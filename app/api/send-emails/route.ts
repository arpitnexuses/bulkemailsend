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

export async function POST(req: Request) {
  try {
    const { contacts, subject, sender, content, smtpConfig, delay, senderName } = await req.json()
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

    // Process contacts in chunks of 10
    const chunkSize = 10;
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < contacts.length; i += chunkSize) {
      const chunk = contacts.slice(i, i + chunkSize);
      
      for (const contact of chunk) {
        try {
          if (delay > 0 && (succeeded + failed) > 0) {
            await sleep(delay * 1000)
          }

          const personalizedContent = content
            .replace(/\{\{name\}\}/g, contact.name || '')
            .replace(/\{\{email\}\}/g, contact.email || '')
            .replace(/\{\{company\}\}/g, contact.company || '')

          const mailOptions = {
            from: {
              name: sender.name,
              address: sender.email
            },
            to: contact.email,
            subject: subject,
            html: personalizedContent,
          }

          await transporter.sendMail(mailOptions)
          succeeded++
        } catch (error) {
          console.error('Error sending to', contact.email, ':', error)
          failed++
        }
      }

      // Add small delay between chunks
      if (i + chunkSize < contacts.length) {
        await sleep(1000)
      }
    }

    return NextResponse.json({
      message: `Email sending complete. ${succeeded} succeeded, ${failed} failed.`,
      succeeded,
      failed,
      total: contacts.length
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

