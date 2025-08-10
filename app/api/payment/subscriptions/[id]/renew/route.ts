import { addMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { createInvoice, createPayment } from "@/lib/helper";

// ===========================================
// 4. Renewal/Payment
// ===========================================
// app/api/subscriptions/[id]/renew/route.ts
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession()
      
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const { billingCycle } = await req.json() // Allow changing billing cycle during renewal
  
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
  
      const subscription = await prisma.subscription.findFirst({
        where: {
          id: params.id,
          userId: user.id,
          status: { in: ["ACTIVE", "SUSPENDED", "EXPIRED"] },
        },
        include: { plan: true, pricingTier: true },
      })
  
      if (!subscription) {
        return NextResponse.json(
          { error: "Subscription not found or cannot be renewed" },
          { status: 404 }
        )
      }
  
      // Get pricing tier (current or new if changing billing cycle)
      let pricingTier = subscription.pricingTier
      if (billingCycle && billingCycle !== pricingTier.billingCycle) {
        const newPricingTier = await prisma.pricingTier.findFirst({
          where: {
            planId: subscription.planId,
            billingCycle,
            isActive: true,
          },
        })
  
        if (!newPricingTier) {
          return NextResponse.json(
            { error: "Invalid billing cycle" },
            { status: 400 }
          )
        }
  
        pricingTier = newPricingTier
        
        // Update subscription with new pricing tier
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { pricingTierId: pricingTier.id },
        })
      }
  
      // Create new invoice for renewal
      const invoice = await createInvoice(
        { ...subscription, pricingTier }, 
        user, 
        true // isRenewal
      )
  
      // Create payment
      const payment = await createPayment(subscription, invoice, user, true)
  
      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          paymentUrl: payment.paymentUrl,
          amount: payment.amount,
          currency: payment.currency,
        },
        invoice: {
          id: invoice.id,
          total: invoice.total,
          periodStart: invoice.periodStart,
          periodEnd: invoice.periodEnd,
        },
      })
  
    } catch (error) {
      console.error("Renewal error:", error)
      return NextResponse.json(
        { error: "Failed to create renewal payment" },
        { status: 500 }
      )
    }
  }
  
 