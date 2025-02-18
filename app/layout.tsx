import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Nexsend',
  description: 'Nexsend is a tool that allows you to send emails to your customers.',
  generator: 'Nexsend',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster
          toastOptions={{
            className: '',
            style: {
              padding: '0',
              background: 'transparent',
              boxShadow: 'none',
            },
          }}
        />
      </body>
    </html>
  )
}
