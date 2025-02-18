"use client"

import { useState, useEffect } from "react"
import EmailForm from "./email-form"
import ContactList from "./contact-list"
import ContactUpload from "./contact-upload"
import type { Contact } from "@/types/contact"
import TimerDisplay from "./timer-display"
import SmtpConfig from "./smtp-config"
import Header from "./Header"
import { toast } from "react-hot-toast"

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailResult {
  email: string;
  status: 'fulfilled' | 'rejected';
  error?: string;
}

export default function EmailSendTool() {
  const [subject, setSubject] = useState("")
  const [sender, setSender] = useState("")
  const [content, setContent] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    host: "",
    port: 587,
    secure: false,
    auth: { user: "", pass: "" }
  })
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
    details?: any[];
  } | null>(null)
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [emailResults, setEmailResults] = useState<EmailResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [delay, setDelay] = useState<number>(0)
  const [senderName, setSenderName] = useState('')

  useEffect(() => {
    const showToast = async () => {
      if (isSending) {
        toast.loading(
          <div className="min-w-[200px]">
            <h3 className="font-semibold text-gray-900 ">Sending Campaign</h3>
            <p className="text-sm text-gray-600">
              Preparing to send your emails...
            </p>
          </div>,
          {
            duration: 2000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(209, 213, 219, 0.3)',
              padding: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.75rem',
              borderLeft: '4px solid #8b5cf6',
            },
          }
        )
      }
    }
    showToast()
  }, [isSending])

  const handleAddContact = () => {
    // Implement add contact modal/form
    console.log("Add contact clicked")
  }

  const handleEditContact = (contact: Contact) => {
    // Implement edit contact logic
    console.log("Edit contact:", contact)
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  const handleContactUpload = (newContacts: Contact[]) => {
    const contactsWithIds = newContacts.map(contact => ({
      ...contact,
      id: contact.id || Math.random().toString(36).substr(2, 9),
      name: contact.firstName && contact.lastName 
        ? `${contact.firstName} ${contact.lastName}`
        : contact.name || "Unknown"
    }))
    setContacts([...contacts, ...contactsWithIds])
  }

  const handleSmtpConfigSubmit = (config: SmtpConfig) => {
    setSmtpConfig(config)
  }

  const handleSmtpReset = () => {
    setSmtpConfig({
      host: "",
      port: 587,
      secure: false,
      auth: { user: "", pass: "" }
    })
  }

  const handleSendEmails = async () => {
    if (!contacts.length || !content || !subject) return
    
    setIsSending(true)

    try {
      const response = await fetch("/api/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts,
          subject,
          sender: {
            email: sender,
            name: senderName || sender
          },
          content,
          smtpConfig: {
            ...smtpConfig,
            host: 'in-v3.mailjet.com',
            port: 587,
            secure: false,
          },
          delay,
        }),
      })

      let data;
      try {
        data = await response.json()
      } catch (e) {
        throw new Error('Failed to parse server response')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails')
      }

      // Success toast - redesigned with null check and error handling
      const successCount = data.succeeded || 0;
      const failureCount = data.failed || 0;

      toast.success(
        <div className="min-w-[300px] relative pr-6">
          <button 
            onClick={() => toast.dismiss()} 
            className="absolute right-0 top-0 p-1 pr-2text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="font-semibold text-gray-900 mb-1">Campaign Sent Successfully!</h3>
          <p className="text-sm text-gray-600">
            {`${successCount} emails sent, ${failureCount} failed`}
          </p>
        </div>,
        {
          duration: Infinity,
          position: 'top-right',
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(209, 213, 219, 0.3)',
            padding: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '0.75rem',
            borderLeft: '4px solid #22c55e',
          },
        }
      )

      // Save campaign history
      await fetch('/api/campaign-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail: sender,
          campaignName: subject,
          emailsSent: successCount,
          emailsFailed: failureCount,
          status: failureCount === 0 ? 'success' : 'partial',
          details: JSON.stringify(data.details || []),
          timestamp: new Date().toISOString()
        })
      })

    } catch (error) {
      console.error("Failed to send emails:", error)
      toast.error(
        <div className="min-w-[300px] relative pr-6">
          <button 
            onClick={() => toast.dismiss()} 
            className="absolute right-0 top-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="font-semibold text-gray-900 mb-1">Campaign Failed</h3>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Failed to send emails'}
          </p>
        </div>,
        {
          duration: Infinity,
          position: 'top-right',
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(209, 213, 219, 0.3)',
            padding: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '0.75rem',
            borderLeft: '4px solid #ef4444',
          },
        }
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleContactReset = () => {
    if (contacts.length === 0) return; // Don't show confirmation if no contacts
    
    if (window.confirm('Are you sure you want to clear all contacts? This action cannot be undone.')) {
      setContacts([]);
      setEmailResults([]); // Clear email results
      setShowResults(false); // Hide results modal
      setError(null); // Clear any error messages
      setSuccess(null); // Clear any success messages
      
      // Reset the file input by finding it and resetting its value
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  return (
    <>
      <time dateTime="2016-10-25" suppressHydrationWarning />
      <div className="min-h-screen bg-[#f8fafc]">
        
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl" />
        </div>
        <Header />
        <div className="relative">
          {/* Header */}
          <header className="py-12 text-center pt-[-4]">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Email Campaign Tool
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Create and send personalized email campaigns to your contacts with ease
            </p>
            <p className="text-xl md:text-2xl text-gray-600 font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pt-4">
              ✨ Integrate with any API marketing tool (Gmail, Mailjet, Brevo, AWS & more) ✨
            </p>
          </header>

          <main className="container mx-auto px-4 max-w-7xl pb-16 space-y-8">
            {/* SMTP Settings - Full Width */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-100/50">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">SMTP Settings</h2>
                    <p className="text-sm text-gray-500">Configure your email server</p>
                  </div>
                </div>
                <button
                  onClick={handleSmtpReset}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Reset SMTP configuration"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              {/* SMTP Form */}
              <SmtpConfig config={smtpConfig} setConfig={setSmtpConfig} />
            </div>

            {/* Two Column Layout for Email Composer and Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Email Composer - Left Column */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-100/50">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Compose Email</h2>
                      <p className="text-sm text-gray-500">Create your campaign</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSubject("");
                      setSender("");
                      setSenderName("");
                      setContent("");
                      setDelay(0);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    title="Reset email form"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <EmailForm
                  subject={subject}
                  setSubject={setSubject}
                  sender={sender}
                  setSender={setSender}
                  senderName={senderName}
                  setSenderName={setSenderName}
                  content={content}
                  setContent={setContent}
                  delay={delay}
                  setDelay={setDelay}
                />
                
                {/* Send Button */}
                <button
                  onClick={handleSendEmails}
                  disabled={contacts.length === 0}
                  className={`group w-full mt-6 py-4 px-6 rounded-xl font-medium text-lg transition-all duration-300 relative overflow-hidden
                    ${contacts.length === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:scale-[1.02] text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send to {contacts.length} Recipients
                  </span>
                </button>
              </div>

              {/* Contact Upload & List - Right Column */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-100/50">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
                      <p className="text-sm text-gray-500">Upload and manage recipients</p>
                    </div>
                  </div>
                  <button
                    onClick={handleContactReset}
                    disabled={contacts.length === 0}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      contacts.length === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Clear all contacts"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <ContactUpload onUpload={handleContactUpload} />
                <div className="mt-6">
                  <ContactList
                    contacts={contacts}
                    onAddNew={handleAddContact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

