import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { QRGenerator } from '@/components/qr/qr-generator'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <Header />
      <Hero />
      <div id="generator" className="container mx-auto px-4 py-4 flex-1 min-h-[600px]">
        <QRGenerator />
      </div>
      <section className="border-t border-slate-200 bg-white/60 py-12 dark:border-slate-700 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            About OpenQR
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
            OpenQR is a free, open-source QR code generator that runs in your browser. Customize
            colors, patterns, and logos, then download a scannable code for links, Wi-Fi access,
            contact cards, events, or product packaging. No account is required.
          </p>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
            For design and print tips, read the{" "}
            <a
              className="font-medium text-indigo-600 underline underline-offset-2 dark:text-indigo-400"
              href="https://darkmintis.dev/blog/make-custom-qr-code-with-logo/"
            >
              guide to custom QR codes with logos
            </a>
            . More developer tools are available on{" "}
            <a
              className="font-medium text-indigo-600 underline underline-offset-2 dark:text-indigo-400"
              href="https://darkmintis.dev/open-source-tools/"
            >
              Darkmintis
            </a>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
