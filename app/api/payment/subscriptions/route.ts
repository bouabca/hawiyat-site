// ===========================================
// 2. Create Subscription
// ===========================================
// app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { addMonths, addQuarters } from "date-fns"
import { createInvoice, createPayment ,calculateEndDate } from "@/lib/helper"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pricingTierId, serverName } = await req.json()

    // Validate inputs
    if (!pricingTierId || !serverName) {
      return NextResponse.json(
        { error: "Pricing tier and server name required" },
        { status: 400 }
      )
    }

    // Find user and pricing tier
    const [user, pricingTier] = await Promise.all([
      prisma.user.findUnique({ where: { email: session.user.email } }),
      prisma.pricingTier.findUnique({ 
        where: { id: pricingTierId },
        include: { plan: true }
      })
    ])

    if (!user || !pricingTier) {
      return NextResponse.json(
        { error: "User or pricing tier not found" },
        { status: 404 }
      )
    }

    // Calculate period dates
    const startDate = new Date()
    const endDate = calculateEndDate(startDate, pricingTier.billingCycle)

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: pricingTier.planId,
        pricingTierId: pricingTier.id,
        serverName,
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
        status: "PENDING",
      },
      include: {
        plan: true,
        pricingTier: true,
      },
    })

    // Create invoice
    const invoice = await createInvoice(subscription, user)

    // Create payment
    const payment = await createPayment(subscription, invoice, user)

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        serverName: subscription.serverName,
        plan: subscription.plan,
        billingCycle: pricingTier.billingCycle,
        status: subscription.status,
      },
      payment: {
        id: payment.id,
        paymentUrl: payment.paymentUrl,
        amount: payment.amount,
        currency: payment.currency,
      },
    })

  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    )
  }
}