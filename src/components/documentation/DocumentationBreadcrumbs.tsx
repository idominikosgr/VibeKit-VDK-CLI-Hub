'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@radix-ui/react-icons'

interface BreadcrumbPage {
  id: string
  title: string
  slug: string
  path: string
}

interface DocumentationBreadcrumbsProps {
  pageId: string
  currentPage: BreadcrumbPage
}

export function DocumentationBreadcrumbs({ pageId, currentPage }: DocumentationBreadcrumbsProps) {
  // For now, we'll build breadcrumbs from the path
  // In a future enhancement, we could call the get_documentation_breadcrumbs function
  const pathSegments = currentPage.path.split('/').filter(Boolean)
  
  interface BreadcrumbItem {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    current?: boolean
  }
  
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/', icon: HomeIcon },
    { title: 'Documentation', href: '/docs' },
  ]

  // Add intermediate segments (if any)
  if (pathSegments.length > 2) {
    for (let i = 2; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i]
      const href = '/' + pathSegments.slice(0, i + 1).join('/')
      breadcrumbs.push({
        title: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        href
      })
    }
  }

  // Add current page
  breadcrumbs.push({
    title: currentPage.title,
    href: currentPage.path,
    current: true
  })

  return (
    <nav className="bg-card/60 backdrop-blur-sm border-b border-border/30 px-8 py-4">
      <div className="max-w-4xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 text-muted-foreground mx-2" />
              )}
              
              {item.current ? (
                <span className="text-foreground font-medium flex items-center gap-2">
                  {'icon' in item && item.icon && <item.icon className="w-4 h-4" />}
                  {item.title}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  {'icon' in item && item.icon && <item.icon className="w-4 h-4" />}
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
} 