import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Add delay between emails to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contacts, subject, sender, content, smtpConfig } = body

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

    // Send emails to all contacts with delay between each
    const results = []
    for (const contact of contacts) {
      try {
        // Replace template variables in content
        const personalizedContent = content
          .replace(/\{\{name\}\}/g, contact.name || '')
          .replace(/\{\{email\}\}/g, contact.email || '')
          .replace(/\{\{company\}\}/g, contact.company || '')

        const mailOptions = {
          from: sender,
          to: contact.email,
          subject: subject,
          html: personalizedContent,
        }

        const result = await transporter.sendMail(mailOptions)
        results.push({ status: 'fulfilled', value: result })
        
        // Add delay between emails
        if (contacts.indexOf(contact) < contacts.length - 1) {
          await delay(2000) // 2 second delay between emails
        }
      } catch (error) {
        results.push({ 
          status: 'rejected', 
          reason: error instanceof Error ? error.message : 'Failed to send email' 
        })
      }
    }

    // Process results
    const succeeded = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    // Send summary
    return NextResponse.json({
      message: `Email sending complete. ${succeeded} succeeded, ${failed} failed.`,
      details: results.map((result, index) => ({
        email: contacts[index].email,
        status: result.status,
        error: result.status === 'rejected' ? result.reason : null
      }))
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

