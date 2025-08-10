// ===========================================
// 7. Cron Job for Expiry Checks
// ===========================================
// app/api/cron/check-expiry/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { subDays, addDays } from "date-fns"

// Define email notification types
type EmailNotificationType = 
  | "RENEWAL_REMINDER_7D"
  | "RENEWAL_REMINDER_3D"
  | "RENEWAL_REMINDER_1D"
  | "INVOICE_CREATED"
  | "SERVICE_SUSPENDED"
  | "SERVICE_TERMINATED"
  | "INVOICE_OVERDUE"

// Define subscription types for different scenarios
type BaseSubscriptionWithDetails = {
  id: string
  userId: string
  status: string
  currentPeriodEnd: Date
  autoRenew: boolean
  cancelAtPeriodEnd: boolean
  user: {
    id: string
    email: string
    name: string | null
  }
  plan: {
    id: string
    name: string
  }
}

type SubscriptionWithPricing = BaseSubscriptionWithDetails & {
  pricingTier: {
    id: string
    price: number
    currency: string
    billingCycle: string
  }
  invoices?: Array<{
    id: string
    periodStart: Date
    periodEnd: Date
  }>
}

type SubscriptionForNotification = BaseSubscriptionWithDetails | SubscriptionWithPricing

export async function GET(req: NextRequest) {
  try {
    // Verify cron authorization
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const results = {
      remindersSent: 0,
      invoicesCreated: 0,
      subscriptionsSuspended: 0,
      subscriptionsTerminated: 0,
    }
    
    // ===========================================
    // 1. Send Renewal Reminders
    // ===========================================
    const reminderChecks = [
      { days: 7, type: "RENEWAL_REMINDER_7D" as const },
      { days: 3, type: "RENEWAL_REMINDER_3D" as const },
      { days: 1, type: "RENEWAL_REMINDER_1D" as const },
    ]

    for (const check of reminderChecks) {
      const reminderDate = addDays(now, check.days)
      const nextDay = addDays(reminderDate, 1)
      
      const subscriptionsToRemind = await prisma.subscription.findMany({
        where: {
          status: "ACTIVE",
          currentPeriodEnd: {
            gte: reminderDate,
            lt: nextDay,
          },
          autoRenew: true,
          cancelAtPeriodEnd: false,
        },
        include: { 
          user: true, 
          plan: true,
          pricingTier: true 
        },
      })

      for (const subscription of subscriptionsToRemind) {
        // Check if reminder already sent today
        const existingLog = await prisma.emailLog.findFirst({
          where: {
            userId: subscription.userId,
            subscriptionId: subscription.id,
            type: check.type,
            sentAt: {
              gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
          },
        })

        if (!existingLog) {
          await sendEmailNotification({
            userId: subscription.userId,
            subscriptionId: subscription.id,
            type: check.type,
            subject: `VPS Renewal Reminder - ${check.days} days left`,
            subscription,
          })
          results.remindersSent++
        }
      }
    }

    // ===========================================
    // 2. Create Invoices for Upcoming Renewals
    // ===========================================
    const upcomingRenewals = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        autoRenew: true,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: {
          gte: now,
          lte: addDays(now, 7), // Create invoices 7 days before renewal
        },
      },
      include: {
        user: true,
        plan: true,
        pricingTier: true,
        invoices: {
          where: {
            periodStart: {
              gte: now, // Future invoices only
            }
          }
        }
      },
    })

    for (const subscription of upcomingRenewals) {
      // Check if invoice already exists for next period
      const hasUpcomingInvoice = subscription.invoices.some(invoice => 
        invoice.periodStart >= subscription.currentPeriodEnd
      )

      if (!hasUpcomingInvoice) {
        // Create invoice for next billing period
        const nextPeriodStart = subscription.currentPeriodEnd
        const nextPeriodEnd = calculateEndDate(nextPeriodStart, subscription.pricingTier.billingCycle)

        await prisma.invoice.create({
          data: {
            subscriptionId: subscription.id,
            userId: subscription.userId,
            invoiceNumber: generateInvoiceNumber(),
            subtotal: subscription.pricingTier.price,
            taxAmount: 0, // Add tax calculation if needed
            total: subscription.pricingTier.price,
            currency: subscription.pricingTier.currency,
            periodStart: nextPeriodStart,
            periodEnd: nextPeriodEnd,
            dueDate: subscription.currentPeriodEnd,
            status: "OPEN",
          },
        })

        await sendEmailNotification({
          userId: subscription.userId,
          subscriptionId: subscription.id,
          type: "INVOICE_CREATED",
          subject: `New Invoice - ${subscription.plan.name} Renewal`,
          subscription,
        })

        results.invoicesCreated++
      }
    }

    // ===========================================
    // 3. Suspend Expired Subscriptions
    // ===========================================
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        currentPeriodEnd: { lt: now },
      },
      include: {
        user: true,
        plan: true,
        pricingTier: true, // Add pricingTier to match type
      }
    })

    if (expiredSubscriptions.length > 0) {
      // Update to suspended status
      await prisma.subscription.updateMany({
        where: {
          id: { in: expiredSubscriptions.map(s => s.id) },
        },
        data: {
          status: "SUSPENDED",
          suspendedAt: now,
        },
      })

      // Send suspension notifications
      for (const subscription of expiredSubscriptions) {
        await sendEmailNotification({
          userId: subscription.userId,
          subscriptionId: subscription.id,
          type: "SERVICE_SUSPENDED",
          subject: "VPS Service Suspended - Payment Required",
          subscription,
        })
      }

      results.subscriptionsSuspended = expiredSubscriptions.length
    }

    // ===========================================
    // 4. Terminate Long-Suspended Subscriptions
    // ===========================================
    const gracePeriodDays = 7 // 7 days grace period after suspension
    const terminationDate = subDays(now, gracePeriodDays)

    const subscriptionsToTerminate = await prisma.subscription.findMany({
      where: {
        status: "SUSPENDED",
        suspendedAt: {
          lte: terminationDate,
        },
      },
      include: {
        user: true,
        plan: true,
        pricingTier: true, // Add pricingTier to match type
      }
    })

    if (subscriptionsToTerminate.length > 0) {
      await prisma.subscription.updateMany({
        where: {
          id: { in: subscriptionsToTerminate.map(s => s.id) },
        },
        data: {
          status: "TERMINATED",
        },
      })

      // Send termination notifications
      for (const subscription of subscriptionsToTerminate) {
        await sendEmailNotification({
          userId: subscription.userId,
          subscriptionId: subscription.id,
          type: "SERVICE_TERMINATED",
          subject: "VPS Service Terminated",
          subscription,
        })
      }

      results.subscriptionsTerminated = subscriptionsToTerminate.length
    }

    // ===========================================
    // 5. Handle Overdue Invoices
    // ===========================================
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: "OPEN",
        dueDate: { lt: now },
      },
      include: {
        subscription: {
          include: {
            user: true,
            plan: true,
            pricingTier: true, // Add pricingTier to match type
          }
        }
      }
    })

    // Update overdue invoices status
    if (overdueInvoices.length > 0) {
      await prisma.invoice.updateMany({
        where: {
          id: { in: overdueInvoices.map(inv => inv.id) },
        },
        data: {
          status: "OVERDUE",
        },
      })

      // Send overdue notifications (only once per invoice)
      for (const invoice of overdueInvoices) {
        const existingOverdueLog = await prisma.emailLog.findFirst({
          where: {
            userId: invoice.userId,
            subscriptionId: invoice.subscriptionId,
            type: "INVOICE_OVERDUE",
            sentAt: {
              gte: subDays(now, 1), // Don't send multiple overdue emails per day
            },
          },
        })

        if (!existingOverdueLog && invoice.subscription) {
          await sendEmailNotification({
            userId: invoice.userId,
            subscriptionId: invoice.subscriptionId!,
            type: "INVOICE_OVERDUE",
            subject: `Overdue Invoice - ${invoice.invoiceNumber}`,
            subscription: invoice.subscription,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
      details: {
        upcomingRenewals: upcomingRenewals.length,
        overdueInvoices: overdueInvoices.length,
      }
    })

  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    )
  }
}

// ===========================================
// Helper Functions
// ===========================================

async function sendEmailNotification({
  userId,
  subscriptionId,
  type,
  subject,
  subscription,
}: {
  userId: string
  subscriptionId: string
  type: EmailNotificationType
  subject: string
  subscription: SubscriptionForNotification
}) {
  try {
    // Add your email sending logic here (Resend, SendGrid, etc.)
    // For now, just log to database
    
    await prisma.emailLog.create({
      data: {
        userId,
        subscriptionId,
        type,
        subject,
        sentAt: new Date(),
        success: true,
      },
    })

    console.log(`Email sent: ${type} to user ${userId} for subscription ${subscription.id}`)
  } catch (error) {
    console.error(`Failed to send email: ${type}`, error)
    
    await prisma.emailLog.create({
      data: {
        userId,
        subscriptionId,
        type,
        subject,
        sentAt: new Date(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })
  }
}

function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const timestamp = now.getTime().toString().slice(-6)
  
  return `INV-${year}${month}-${timestamp}`
}

function calculateEndDate(startDate: Date, billingCycle: string): Date {
  const start = new Date(startDate)
  
  switch (billingCycle) {
    case "MONTHLY":
      return addDays(start, 30)
    case "QUARTERLY":
      return addDays(start, 90)
    case "SEMI_ANNUAL":
      return addDays(start, 180)
    case "ANNUAL":
      return addDays(start, 365)
    default:
      return addDays(start, 30)
  }
}