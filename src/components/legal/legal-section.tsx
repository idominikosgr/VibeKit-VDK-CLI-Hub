"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { Icons } from "@/components/icons"

interface LegalSectionProps {
  title: string
  icon?: keyof typeof Icons
  children: ReactNode
  highlight?: boolean
}

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
}

export function LegalSection({ title, icon, children, highlight = false }: LegalSectionProps) {
  const IconComponent = icon ? Icons[icon] : null

  return (
    <motion.section
      className={`relative p-6 rounded-xl border transition-all duration-300 ${
        highlight 
          ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-lg' 
          : 'bg-muted/20 border-border/40 hover:bg-muted/30 hover:border-border/60'
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            highlight 
              ? 'bg-gradient-to-br from-primary to-accent text-white' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className={`text-xl font-semibold mb-4 ${
            highlight ? 'text-primary' : 'text-foreground'
          }`}>
            {title}
          </h2>
          <div className="prose prose-base dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </motion.section>
  )
} 