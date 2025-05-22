import Link from "next/link"

import { Icons } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">CodePilotRules Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A hub for AI-assisted development rules and guidelines.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/rules" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Rules Catalog
                </Link>
              </li>
              <li>
                <Link 
                  href="/docs" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/setup" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Setup Wizard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/contribute" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contribute
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/idominikosgr/CodePilotRules" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link 
                  href="/discord" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/license" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  License (MIT)
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CodePilotRules. All rights reserved.</p>
          <p className="mt-2">
            Original DevRules by Seth Rose. CodePilotRules Enhancements by Dominikos Pritis.
          </p>
        </div>
      </div>
    </footer>
  )
}
