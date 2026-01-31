'use client'

import { Sparkles, Zap, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
            Create Beautiful QR Codes
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>

        </div>
      </div>
    </section>
  )
}
