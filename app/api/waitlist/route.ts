import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Zod schema for email validation
const WaitlistSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long')
    .transform(email => email.toLowerCase().trim())
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate request body with Zod
    const validationResult = WaitlistSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => err.message)
      return res.status(400).json({ 
        error: errors[0] || 'Invalid email format'
      })
    }

    const { email } = validationResult.data

    // Get IP address (handle various proxy scenarios)
    const ipAddress = 
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] as string ||
      req.socket.remoteAddress ||
      'unknown'

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'unknown'

    // Check if email already exists
    const existingUser = await prisma.waitlist.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Get position of existing user
      const position = await prisma.waitlist.count({
        where: {
          createdAt: {
            lte: existingUser.createdAt
          }
        }
      })

      return res.status(409).json({ 
        error: 'Email already exists in waitlist',
        position 
      })
    }

    // Create waitlist entry
    const signup = await prisma.waitlist.create({
      data: {
        email,
        ipAddress,
        userAgent
      }
    })

    // Get position in waitlist
    const position = await prisma.waitlist.count({
      where: {
        createdAt: {
          lte: signup.createdAt
        }
      }
    })

    res.status(201).json({ 
      success: true, 
      message: 'Successfully joined waitlist!',
      position 
    })

  } catch (error: any) {
    console.error('Waitlist signup error:', error)
    
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists in waitlist' })
    }

    // Handle other database errors
    if (error.code?.startsWith('P')) {
      return res.status(500).json({ error: 'Database error occurred' })
    }

    res.status(500).json({ error: 'Failed to join waitlist' })
  }
}

// Optional: Export the schema for reuse in other parts of your app
export { WaitlistSchema }