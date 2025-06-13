'use client'

import { FileTextIcon, BookOpenIcon, ArrowRightIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Mapped interface for component compatibility
interface DocumentationPage {
  id: string
  title: string
  slug: string
  icon?: string
  parent_id?: string
  order_index: number
  path: string
  excerpt?: string
  updated_at: string
  word_count?: number
  reading_time_minutes?: number
}

interface DocsOverviewClientProps {
  rootPages: DocumentationPage[]
  featuredPages: DocumentationPage[]
  allPages: DocumentationPage[]
}

export function DocsOverviewClient({ rootPages, featuredPages, allPages }: DocsOverviewClientProps) {
  return (
    <div className="flex-1 flex flex-col bg-background/30 overflow-auto">
      {/* Header */}
      <div className="bg-card/60 backdrop-blur-sm border-b border-border/30 px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <BookOpenIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Documentation</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Comprehensive guides and resources to help you get started
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/docs/edit">
              <Button 
                variant="outline" 
                className="bg-background/50 hover:bg-background/80 border-border/50"
              >
                <FileTextIcon className="w-4 h-4 mr-2" />
                Edit Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Quick Start */}
          {rootPages.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ArrowRightIcon className="w-4 h-4 text-primary" />
                </div>
                Quick Start
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rootPages.slice(0, 6).map((page) => (
                  <Link
                    key={page.id}
                    href={`/docs/${page.slug}`}
                    className="group p-6 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      {page.icon && (
                        <span className="text-3xl">{page.icon}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {page.title}
                        </h3>
                        {page.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {page.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Recently Updated */}
          {featuredPages.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileTextIcon className="w-4 h-4 text-accent" />
                </div>
                Recently Updated
              </h2>
              <div className="space-y-4">
                {featuredPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/docs/${page.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-card/30 transition-all duration-200"
                  >
                    {page.icon && (
                      <span className="text-2xl">{page.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      {page.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {page.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      <div>Updated {new Date(page.updated_at).toLocaleDateString()}</div>
                      {page.reading_time_minutes && (
                        <div className="mt-1">{page.reading_time_minutes} min read</div>
                      )}
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {allPages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileTextIcon className="w-10 h-10 text-primary/70" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">No Documentation Yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Get started by creating your first documentation page. Build a comprehensive knowledge base for your team.
              </p>
              <Link href="/docs/edit">
                <Button 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
                  size="lg"
                >
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Create First Page
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 