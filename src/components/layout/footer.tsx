import Link from 'next/link'
import { DonationDialog } from './donation-dialog'

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground">
            © 2025{' '}
            <a 
              href="https://darkmintis.dev/openqr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              OpenQR
            </a>
            . Built by{' '}
            <a 
              href="https://github.com/Darkmintis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              Darkmintis
            </a>
          </p>
          <div className="flex items-center space-x-3">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <div className="ml-2" style={{ position: 'relative' }}>
              <DonationDialog />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
