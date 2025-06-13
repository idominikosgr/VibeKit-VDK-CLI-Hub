'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileTextIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DocumentationPage {
  id: string
  title: string
  slug: string
  icon?: string | null
  parent_id?: string | null
  order_index: number | null
  path: string
}

interface DocumentationSidebarProps {
  pages: DocumentationPage[]
  currentPageId?: string
  baseHref: string
}

export function DocumentationSidebar({ pages, currentPageId, baseHref }: DocumentationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Build hierarchical page structure
  const pageMap = new Map<string, DocumentationPage>()
  pages.forEach(page => pageMap.set(page.id, page))

  const rootPages = pages
    .filter(page => !page.parent_id)
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

  const getChildren = (parentId: string) => {
    return pages
      .filter(page => page.parent_id === parentId)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  }

  const filteredPages = searchQuery
    ? pages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rootPages

  const renderPageItem = (page: DocumentationPage, level: number = 0) => {
    const children = getChildren(page.id)
    const isActive = page.id === currentPageId
    const isExpanded = isActive || children.some(child => child.id === currentPageId)

    return (
      <div key={page.id}>
        <Link
          href={`${baseHref}/${page.slug}`}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
            ${isActive 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }
          `}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {page.icon && (
            <span className="text-base">{page.icon}</span>
          )}
          <span className="flex-1 truncate">{page.title}</span>
        </Link>

        {/* Render children if expanded */}
        {(isExpanded || searchQuery) && children.length > 0 && (
          <div className="mt-1">
            {children.map(child => renderPageItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-80 bg-card/80 backdrop-blur-sm border-r border-border/50 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FileTextIcon className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Documentation</h1>
        </div>
        
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-background/50 border-border/50 focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Pages List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => renderPageItem(page))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileTextIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm font-medium mb-1">No pages found</p>
              <p className="text-xs">Try adjusting your search</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/30">
        <Link 
          href="/docs"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileTextIcon className="w-4 h-4" />
          <span>All Documentation</span>
        </Link>
      </div>
    </div>
  )
} 