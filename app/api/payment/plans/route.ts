// ===========================================
// 1. Get Plans with Pricing Tiers
// ===========================================
// app/api/plans/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Define the pricing tier structure
interface PricingTierInfo {
  id: string
  price: number
  currency: string
  discountPercent: number | null
}

// Define billing cycle types (adjust based on your actual billing cycles)
type BillingCycle = "MONTHLY" | "QUARTERLY" | "YEARLY"

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      include: {
        pricingTiers: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { name: "asc" },
    })

    // Transform data for frontend
    const formattedPlans = plans.map(plan => ({
      ...plan,
      pricing: plan.pricingTiers.reduce((acc, tier) => {
        acc[tier.billingCycle as BillingCycle] = {
          id: tier.id,
          price: tier.price,
          currency: tier.currency,
          discountPercent: tier.discountPercent,
        }
        return acc
      }, {} as Record<BillingCycle, PricingTierInfo>)
    }))

    return NextResponse.json({ plans: formattedPlans })
  } catch (error) {
    console.error("Plans fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    )
  }
}