import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Define EmailResult interface
interface EmailResult {
  email: string;
  status: 'fulfilled' | 'rejected';
  error?: string;
  value?: any;
}

// Rename the delay function to sleep to avoid naming conflicts
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: Request) {
  try {
    const { contacts, subject, sender, content, smtpConfig, delay, senderName } = await request.json()
    const results: EmailResult[] = []

    // Create transporter with user-provided SMTP config
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
    })

    // Verify SMTP connection
    try {
      await transporter.verify()
    } catch (error) {
      console.error('SMTP Verification failed:', error)
      return NextResponse.json(
        { error: 'SMTP configuration is invalid. Please check your settings.' },
        { status: 400 }
      )
    }

    for (const contact of contacts) {
      try {
        if (delay > 0 && results.length > 0) {
          // Only delay between emails, not before the first one
          await sleep(delay * 1000)
        }

        // Replace template variables in content
        const personalizedContent = content
          .replace(/\{\{name\}\}/g, contact.name || '')
          .replace(/\{\{email\}\}/g, contact.email || '')
          .replace(/\{\{company\}\}/g, contact.company || '')

        const mailOptions = {
          from: {
            name: sender.name,
            address: sender.email  // Must be verified in Mailjet
          },
          to: contact.email,
          subject: subject,
          html: personalizedContent,
        }

        const result = await transporter.sendMail(mailOptions)
        results.push({
          email: contact.email,
          status: 'fulfilled',
          value: result
        })
      } catch (error) {
        console.error('Error sending to', contact.email, ':', error)
        results.push({
          email: contact.email,
          status: 'rejected',
          error: error instanceof Error ? error.message : 'Failed to send email'
        })
      }
    }

    // Process results
    const succeeded = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      message: `Email sending complete. ${succeeded} succeeded, ${failed} failed.`,
      details: results
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

