"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-2 text-sm font-medium">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105",
              pathname === item.href
                ? "text-primary bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-primary/20 shadow-lg"
                : "text-foreground/70 hover:text-primary hover:bg-white/30 dark:hover:bg-gray-800/30 hover:backdrop-blur-sm hover:border hover:border-primary/20 hover:shadow-md",
              item.disabled && "pointer-events-none opacity-50",
              "group overflow-hidden"
            )}
            style={pathname === item.href ? {
              boxShadow: `
                0 4px 12px rgba(139, 92, 246, 0.2),
                0 0 0 1px rgba(139, 92, 246, 0.1),
                inset 0 1px 2px rgba(255, 255, 255, 0.1)
              `
            } : {}}
          >
            {/* Hover glass highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            <span className="relative drop-shadow-sm">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
