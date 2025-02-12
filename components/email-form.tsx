"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import Ace Editor with proper configuration
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace')
    await Promise.all([
      import('ace-builds/src-noconflict/mode-html'),
      import('ace-builds/src-noconflict/theme-tomorrow'),
      import('ace-builds/src-noconflict/ext-language_tools')
    ])
    return ace
  },
  {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-md" />
  }
)

interface EmailFormProps {
  subject: string
  setSubject: (value: string) => void
  sender: string
  setSender: (value: string) => void
  senderName: string
  setSenderName: (value: string) => void
  content: string
  setContent: (value: string) => void
  delay: number
  setDelay: (value: number) => void
}

const delayOptions = [
  { value: 0, label: 'No Delay' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 3600, label: '1 hour' }
]

interface EmailFormData {
  to: string;
  subject: string;
  message: string;
  senderName: string;
}

export default function EmailForm({ 
  subject, 
  setSubject, 
  sender, 
  setSender,
  senderName,
  setSenderName,
  content, 
  setContent,
  delay,
  setDelay
}: EmailFormProps) {
  const [showPreview, setShowPreview] = useState(false)

  const handleDelayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDelay = parseInt(e.target.value, 10)
    setDelay(newDelay)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Compose Email
        </h2>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Delay:
          </label>
          <select
            value={delay}
            onChange={handleDelayChange}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
          >
            {delayOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
            placeholder="Enter a compelling subject line..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sender Name
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sender Email
          </label>
          <input
            type="email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-300"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Content (HTML)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              Preview Email
            </button>
          </div>
          
          <div className={`space-y-4 ${showPreview ? 'grid grid-cols-2 gap-6' : ''}`}>
            <div className={showPreview ? 'h-[500px]' : ''}>
              <AceEditor
                mode="html"
                theme="tomorrow"
                onChange={setContent}
                name="email-content"
                value={content}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  useWorker: false,
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                width="100%"
                height="500px"
                className="border border-gray-200 rounded-lg shadow-sm"
                placeholder={`<h1>Hello {{name}}</h1>
<p>This is your email content. You can use these template variables:</p>
<ul>
  <li>{{name}} - Contact's name</li>
  <li>{{email}} - Contact's email</li>
  <li>{{company}} - Contact's company</li>
</ul>`}
              />
            </div>

            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900">Email Preview</h3>
                      <p className="text-sm text-gray-500">Subject: {subject}</p>
                      <p className="text-sm text-gray-500">From: {senderName} {sender}</p>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-6">
                    <div 
                      className="prose prose-sm max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-blue-600"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                  <div className="p-4 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-8">
          <p className="text-sm font-medium text-gray-700 mb-2">Available template variables:</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>{"{{name}} - Contact's name"}</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>{"{{email}} - Contact's email"}</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>{"{{company}} - Contact's company"}</span>
            </li>
          </ul>
        </div>
      </form>
    </div>
  )
}

