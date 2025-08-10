// ===========================================
// 3. Subscription Management
// ===========================================
// app/api/subscriptions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        plan: true,
        pricingTier: true,
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}

// Update subscription (change plan, billing cycle, etc.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, ...data } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: { plan: true, pricingTier: true },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    let updatedSubscription

    switch (action) {
      case "cancel":
        updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            cancelAtPeriodEnd: true,
            canceledAt: new Date(),
          },
        })
        break

      case "reactivate":
        updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            cancelAtPeriodEnd: false,
            canceledAt: null,
            status: "ACTIVE",
          },
        })
        break

      case "change_billing_cycle":
        const newPricingTier = await prisma.pricingTier.findFirst({
          where: {
            planId: subscription.planId,
            billingCycle: data.billingCycle,
            isActive: true,
          },
        })

        if (!newPricingTier) {
          return NextResponse.json(
            { error: "Invalid billing cycle" },
            { status: 400 }
          )
        }

        updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            pricingTierId: newPricingTier.id,
          },
        })
        break

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true, 
      subscription: updatedSubscription 
    })

  } catch (error) {
    console.error("Subscription update error:", error)
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    )
  }
}