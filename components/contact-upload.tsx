"use client"

import { useState } from "react"
import { parse } from 'csv-parse/sync'
import type { Contact } from "@/types/contact"

interface ContactUploadProps {
  onUpload: (contacts: Contact[]) => void
}

export default function ContactUpload({ onUpload }: ContactUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setFile(file)
    try {
      const text = await file.text()
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      })

      // Validate and transform the records
      const contacts: Contact[] = records.map((record: any, index: number) => {
        // Check for required fields
        if (!record.firstname && !record.lastname && !record.email) {
          throw new Error(`Row ${index + 2}: Missing required fields (firstname, lastname, or email)`)
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          name: `${record.firstname || ''} ${record.lastname || ''}`.trim(),
          email: record.email,
          firstName: record.firstname || '',
          lastName: record.lastname || '',
          company: record.company || ''
        }
      })

      if (contacts.length === 0) {
        throw new Error('No valid contacts found in the CSV file')
      }

      onUpload(contacts)
      setSuccess(`Successfully uploaded ${contacts.length} contacts`)
      setError(null)
    } catch (err) {
      console.error('Error parsing CSV:', err)
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file')
      setSuccess(null)
    }
  }

  const handleReset = () => {
    setFile(null)
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upload Contacts</h2>
        
      </div>
      
      <div className="relative group">
        <div className={`
          border-2 border-dashed rounded-xl p-10
          bg-gray-50/50 hover:bg-gray-50
          transition-all duration-300 ease-in-out
          ${file ? 'border-blue-400 bg-blue-50/50' : 'border-gray-200'}
        `}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className={`
              p-4 rounded-full 
              ${file ? 'bg-blue-100/80' : 'bg-gray-100/80'}
              group-hover:scale-110 transition-transform duration-300
            `}>
              <svg 
                className={`w-8 h-8 ${file ? 'text-blue-600' : 'text-gray-500'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-gray-700">
                <span className="text-blue-600 font-semibold hover:text-blue-700">
                  Click to upload
                </span>
                {' '}or drag and drop
              </div>
              <p className="text-sm text-gray-500">CSV files only</p>
            </div>
            {file && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{file.name}</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="font-medium text-gray-700 mb-3">Required CSV Headers:</p>
        <div className="grid grid-cols-2 gap-2">
          {['firstname', 'lastname', 'email', 'company (optional)'].map((header) => (
            <div 
              key={header}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{header}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

