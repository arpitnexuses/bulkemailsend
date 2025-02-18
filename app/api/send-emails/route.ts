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
  // Set response headers immediately
  const headers = {
    'Content-Type': 'application/json',
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=60'
  };

  try {
    const { contacts, subject, sender, content, smtpConfig, delay, senderName } = await req.json()
    let succeeded = 0;
    let failed = 0;

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
      // Add timeout settings
      tls: {
        rejectUnauthorized: false
      },
      pool: true,
      maxConnections: 5,
      maxMessages: Infinity,
      rateDelta: 1000,
      rateLimit: 5
    })

    try {
      await transporter.verify()
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: 'SMTP configuration is invalid. Please check your settings.' 
        }), 
        { status: 400, headers }
      )
    }

    const chunkSize = 5; // Reduced chunk size
    
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

      if (i + chunkSize < contacts.length) {
        await sleep(1500) // Increased delay between chunks
      }
    }

    // Close the connection pool
    transporter.close();

    return new Response(
      JSON.stringify({
        message: `Email sending complete. ${succeeded} succeeded, ${failed} failed.`,
        succeeded,
        failed,
        total: contacts.length
      }),
      { status: 200, headers }
    )
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to send emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers }
    )
  }
}

