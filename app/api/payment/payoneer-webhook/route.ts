// ===========================================
// 5. Updated Webhook Handler
// ===========================================
// app/api/payoneer-webhook/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import  { calculateEndDate } from "@/lib/helper"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("payoneer-signature")

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.PAYONEER_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (signature !== `sha256=${expectedSignature}`) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const webhookData = JSON.parse(body)
    const { payment_id, status, metadata } = webhookData

    // Find payment with full relations
    const payment = await prisma.payment.findUnique({
      where: { payoneerPaymentId: payment_id },
      include: { 
        subscription: { include: { plan: true, pricingTier: true } },
        invoice: true,
        user: true 
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const isRenewal = metadata?.is_renewal === "true"

    if (status === "completed") {
      // Update payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      })

      // Update invoice
      if (payment.invoice) {
        await prisma.invoice.update({
          where: { id: payment.invoice.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        })
      }

      // Update subscription
      if (payment.subscription) {
        const newEndDate = calculateEndDate(
          payment.subscription.currentPeriodEnd > new Date() 
            ? payment.subscription.currentPeriodEnd 
            : new Date(),
          payment.subscription.pricingTier.billingCycle
        )

        await prisma.subscription.update({
          where: { id: payment.subscription.id },
          data: {
            status: "ACTIVE",
            currentPeriodEnd: newEndDate,
            suspendedAt: null,
            activatedAt: isRenewal ? payment.subscription.activatedAt : new Date(),
            // Mock VPS provisioning for new subscriptions
            ...(isRenewal ? {} : {
              serverIP: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
            }),
          },
        })

        // Send notification email
        await sendEmailNotification({
          userId: payment.userId,
          subscriptionId: payment.subscription.id,
          type: isRenewal ? "PAYMENT_SUCCESS" : "WELCOME",
        })
      }

    } else if (status === "failed") {
      // Update payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
        },
      })

      // Update invoice
      if (payment.invoice) {
        await prisma.invoice.update({
          where: { id: payment.invoice.id },
          data: { status: "OVERDUE" },
        })
      }

      // Send failure email
      if (payment.subscription) {
        await sendEmailNotification({
          userId: payment.userId,
          subscriptionId: payment.subscription.id,
          type: "PAYMENT_FAILED",
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function sendEmailNotification({
  userId,
  subscriptionId,
  type,
}: {
  userId: string
  subscriptionId: string
  type: string
}) {
  try {
    await prisma.emailLog.create({
      data: {
        userId,
        subscriptionId,
        type: type as any,
        subject: `VPS ${type.replace('_', ' ').toLowerCase()}`,
        success: true,
      },
    })
    
    console.log(`Email sent: ${type} to user ${userId}`)
  } catch (error) {
    console.error("Email sending failed:", error)
  }
}