'use client'

import { useState } from 'react'
import { SerializedEditorState } from 'lexical'
import { BookmarkIcon, ClockIcon, EyeIcon } from '@phosphor-icons/react'
import { AdvancedPencilSimple } from '@/components/blocks/advanced-editor'

// Parse page content helper function
function parsePageContent(content: any) {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content)
    } catch {
      // If it's not valid JSON, return a simple text node structure
      return {
        root: {
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: content
                }
              ]
            }
          ]
        }
      }
    }
  }
  return content
}

interface DocumentationPage {
  id: string
  title: string
  content: string | SerializedEditorState
  icon?: string | null
  cover_image?: string | null
  excerpt?: string | null
  word_count?: number | null
  reading_time_minutes?: number | null
  created_at: string | null
  updated_at: string | null
  children: Array<{
    id: string
    title: string
    slug: string
    status: string | null
    icon?: string | null
    excerpt?: string | null
    order_index: number | null
  }>
}

interface DocumentationViewerProps {
  page: DocumentationPage
}

export function DocumentationViewer({ page }: DocumentationViewerProps) {
  const [viewCount, setViewCount] = useState(0)

  // Parse the content to ensure it's in the right format
  const parsedContent = parsePageContent(page.content)

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Cover Image */}
      {page.cover_image && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={page.cover_image} 
            alt={page.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {page.icon && (
            <span className="text-4xl">{page.icon}</span>
          )}
          <h1 className="text-4xl font-bold text-foreground">{page.title}</h1>
        </div>

        {/* Page Metadata */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
          {page.reading_time_minutes && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>{page.reading_time_minutes} min read</span>
            </div>
          )}
          
          {page.word_count && (
            <div className="flex items-center gap-2">
              <span>{page.word_count.toLocaleString()} words</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4" />
            <span>Updated {new Date(page.updated_at || new Date().toISOString()).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Excerpt */}
        {page.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {page.excerpt}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <AdvancedPencilSimple
          editorSerializedState={parsedContent}
          onSerializedChange={() => {}} // No-op for read-only
          placeholder=""
          className="bg-transparent border-none shadow-none"
          editable={false}
        />
      </div>

      {/* Child Pages */}
      {page.children && page.children.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-semibold text-foreground mb-6">In this section</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {page.children
              .filter(child => child.status === 'published')
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map((child) => (
                <a
                  key={child.id}
                  href={`/docs/${child.slug}`}
                  className="group p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    {child.icon && (
                      <span className="text-2xl">{child.icon}</span>
                    )}
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {child.title}
                      </h3>
                      {child.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {child.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  )
} 