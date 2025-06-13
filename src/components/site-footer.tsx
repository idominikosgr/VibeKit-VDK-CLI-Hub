"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { Icons } from "@/components/icons"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function SiteFooter() {
  return (
    <motion.footer 
      className="border-t border-primary/20 dark:border-purple-800/30 py-8 md:py-12 bg-gradient-to-t from-white/50 via-primary/5 to-purple-50/30 dark:from-gray-950/70 dark:via-purple-950/10 dark:to-gray-950/70 backdrop-blur-xl relative"
      style={{
        boxShadow: `
          0 -8px 32px rgba(139, 92, 246, 0.1),
          0 0 0 1px rgba(139, 92, 246, 0.1),
          inset 0 1px 2px rgba(255, 255, 255, 0.1)
        `
      }}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle glass overlay with brand colors */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/3 to-purple-100/10 dark:via-purple-900/5 dark:to-purple-800/5 pointer-events-none" />
              <div className="container max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
          <div>
            <motion.div 
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Vibe Coding Rules Hub
              </span>
            </motion.div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A comprehensive hub for AI-assisted development rules and guidelines, enhancing your coding workflow.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/rules" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.code className="h-3 w-3" />
                    Rules Catalog
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/hub" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.brain className="h-3 w-3" />
                    Framework
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/docs" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.documentation className="h-3 w-3" />
                    Documentation
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/setup" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.settings className="h-3 w-3" />
                    Setup Wizard
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4 text-foreground">Community</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/contribute" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.userPlus className="h-3 w-3" />
                    Contribute
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <a 
                    href="https://github.com/idominikosgr/Vibe-Coding-Rules-hub" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icons.github className="h-3 w-3" />
                    GitHub
                  </a>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/discord" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.folder className="h-3 w-3" />
                    Discord
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/privacy" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.security className="h-3 w-3" />
                    Privacy Policy
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/terms" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.documentation className="h-3 w-3" />
                    Terms of Service
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link 
                    href="/license" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.check className="h-3 w-3" />
                    License (MIT)
                  </Link>
                </motion.div>
              </li>
            </ul>
          </div>
        </motion.div>
        <motion.div 
          className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground"
          variants={fadeInUp}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="mb-2">
            &copy; {new Date().getFullYear()} Vibe Coding Rules. All rights reserved.
          </p>
          <p className="leading-relaxed">
            Original DevRules by{" "}
            <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
              <a 
                href="https://github.com/sethrose" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Seth Rose
              </a>
            </motion.span>
            . Vibe Coding Rules Enhancements by{" "}
            <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
              <a 
                href="https://github.com/idominikosgr" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Dominikos Pritis
              </a>
            </motion.span>
            .
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
