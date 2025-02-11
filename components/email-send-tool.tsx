"use client"

import { useState } from "react"
import EmailForm from "./email-form"
import ContactList from "./contact-list"
import ContactUpload from "./contact-upload"
import type { Contact } from "@/types/contact"

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
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

  const handleSendEmails = async () => {
    setIsSending(true)
    setSendResult(null)

    try {
      const response = await fetch("/api/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts,
          subject,
          sender,
          content,
          smtpConfig,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to send emails')

      setSendResult({
        success: true,
        message: data.message,
        details: data.details
      })
    } catch (error) {
      setSendResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send emails'
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="py-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Email Campaign Tool
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Create and send personalized email campaigns to your contacts with ease
          </p>
        </header>

        <main className="container mx-auto px-4 max-w-7xl pb-16 space-y-8">
          {/* SMTP Settings - Full Width */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">SMTP Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure your email server</p>
              </div>
            </div>
            {/* SMTP Form */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="smtp.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({...smtpConfig, port: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={smtpConfig.auth.user}
                  onChange={(e) => setSmtpConfig({
                    ...smtpConfig, 
                    auth: {...smtpConfig.auth, user: e.target.value}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={smtpConfig.auth.pass}
                  onChange={(e) => setSmtpConfig({
                    ...smtpConfig, 
                    auth: {...smtpConfig.auth, pass: e.target.value}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
          </div>

          {/* Two Column Layout for Email Composer and Contacts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Email Composer - Left Column */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compose Email</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create your campaign</p>
                </div>
              </div>
              <EmailForm
                subject={subject}
                setSubject={setSubject}
                sender={sender}
                setSender={setSender}
                content={content}
                setContent={setContent}
              />
              
              {/* Send Button */}
              <button
                onClick={handleSendEmails}
                disabled={contacts.length === 0 || isSending}
                className={`group w-full mt-6 py-4 px-6 rounded-xl font-medium text-lg transition-all duration-300 relative overflow-hidden
                  ${contacts.length === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' 
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contacts</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload and manage recipients</p>
                </div>
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

      {/* Loading Overlay */}
      {isSending && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 dark:bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse opacity-20" />
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-spin" style={{ clipPath: 'inset(0 0 50% 0)' }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin" style={{ clipPath: 'inset(50% 0 0 0)', animationDirection: 'reverse' }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sending Campaign</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Sending your emails to {contacts.length} recipients...
              </p>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 animate-progress" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {sendResult && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center space-y-6">
              {sendResult.success ? (
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-[scale_0.5s_ease-out]">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-[scale_0.5s_ease-out]">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              
              <h3 className={`text-2xl font-bold ${
                sendResult.success ? 'text-green-500' : 'text-red-500'
              }`}>
                {sendResult.success ? 'Campaign Sent!' : 'Sending Failed'}
              </h3>
              
              <p className="text-gray-600 text-center text-lg">
                {sendResult.message}
              </p>

              {sendResult.details && (
                <div className="w-full max-h-60 overflow-auto rounded-xl border border-gray-100 bg-gray-50">
                  <div className="p-4 space-y-2">
                    {sendResult.details.map((detail, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                          detail.status === 'fulfilled' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {detail.status === 'fulfilled' ? (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className="font-medium">{detail.email}</span>
                        {detail.error && (
                          <span className="text-xs opacity-75">- {detail.error}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSendResult(null)}
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

