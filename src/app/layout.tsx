import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://darkmintis.dev/openqr'),
  title: 'OpenQR - The Best QR Code Generator',
  description: 'Create beautiful, customizable QR codes instantly. Free, open-source, and feature-rich QR code generator.',
  keywords: ['QR code', 'QR generator', 'custom QR', 'beautiful QR', 'best QR generator', 'open source'],
  authors: [{ name: 'Darkmintis' }],
  creator: 'Darkmintis',
  openGraph: {
    title: 'OpenQR - The Best QR Code Generator',
    description: 'Create beautiful, customizable QR codes instantly.',
    url: 'https://darkmintis.dev/openqr',
    siteName: 'OpenQR',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenQR - The Best QR Code Generator',
    description: 'Create beautiful, customizable QR codes instantly.',
  },
  icons: {
    icon: '/OpenQR/favicon.ico',
    shortcut: '/OpenQR/favicon-16x16.png',
    apple: '/OpenQR/apple-touch-icon.png',
  },
  manifest: '/OpenQR/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
