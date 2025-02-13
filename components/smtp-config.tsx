import type React from "react"
import type { SmtpConfig } from "@/types/smtp-config"

interface SmtpConfigProps {
  config: SmtpConfig
  setConfig: (config: SmtpConfig) => void
}

export default function SmtpConfig({ config, setConfig }: SmtpConfigProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
      auth: name.startsWith("auth.") ? { ...config.auth, [name.split(".")[1]]: value } : config.auth,
    })
  }

  const handleReset = () => {
    setConfig({
      host: 'in-v3.mailjet.com',
      port: 587,
      secure: false,
      auth: {
        user: 'YOUR_API_KEY',
        pass: 'YOUR_SECRET_KEY'
      }
    })
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">SMTP Configuration</h2>
          <div className="rounded-full bg-blue-50 px-3 py-1 dark:bg-blue-900/30">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Server Settings</span>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="host" className="text-sm font-medium text-gray-900 dark:text-gray-200">
            SMTP Host
          </label>
          <input
            type="text"
            id="host"
            name="host"
            value={config.host}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            placeholder="smtp.example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="port" className="text-sm font-medium text-gray-900 dark:text-gray-200">
            SMTP Port
          </label>
          <input
            type="number"
            id="port"
            name="port"
            value={config.port}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            placeholder="587"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="auth.user" className="text-sm font-medium text-gray-900 dark:text-gray-200">
            SMTP Username
          </label>
          <input
            type="text"
            id="auth.user"
            name="auth.user"
            value={config.auth.user}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="auth.pass" className="text-sm font-medium text-gray-900 dark:text-gray-200">
            SMTP Password
          </label>
          <input
            type="password"
            id="auth.pass"
            name="auth.pass"
            value={config.auth.pass}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            name="secure"
            checked={config.secure}
            onChange={handleChange}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/25 dark:bg-gray-700 dark:peer-focus:ring-blue-800/20"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-200">Use Secure Connection (TLS)</span>
        </label>
      </div>
    </div>
  )
}

