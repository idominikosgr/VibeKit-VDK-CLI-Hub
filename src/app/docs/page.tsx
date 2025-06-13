import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client'
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar'
import Link from 'next/link'
import { DocsOverviewClient } from './docs-overview-client'

// Database result interface for getAllPublishedPages
interface BasicDocumentationPage {
  id: string
  title: string
  slug: string
  icon: string | null
  parent_id: string | null
  order_index: number | null
  path: string
  excerpt: string | null
  updated_at: string | null
}

// Database result interface for getFeaturedPages
interface FeaturedDocumentationPage {
  id: string
  title: string
  slug: string
  icon: string | null
  excerpt: string | null
  updated_at: string | null
  word_count: number | null
  reading_time_minutes: number | null
}

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

// Map basic database result to component interface
function mapBasicPageToPage(dbPage: BasicDocumentationPage): DocumentationPage {
  return {
    id: dbPage.id,
    title: dbPage.title,
    slug: dbPage.slug,
    icon: dbPage.icon || undefined,
    parent_id: dbPage.parent_id || undefined,
    order_index: dbPage.order_index || 0,
    path: dbPage.path,
    excerpt: dbPage.excerpt || undefined,
    updated_at: dbPage.updated_at || new Date().toISOString(),
  }
}

// Map featured database result to component interface
function mapFeaturedPageToPage(dbPage: FeaturedDocumentationPage): DocumentationPage {
  return {
    id: dbPage.id,
    title: dbPage.title,
    slug: dbPage.slug,
    icon: dbPage.icon || undefined,
    parent_id: undefined, // Not selected in featured query
    order_index: 0, // Not selected in featured query
    path: `/docs/${dbPage.slug}`, // Construct path from slug
    excerpt: dbPage.excerpt || undefined,
    updated_at: dbPage.updated_at || new Date().toISOString(),
    word_count: dbPage.word_count || undefined,
    reading_time_minutes: dbPage.reading_time_minutes || undefined,
  }
}

// Get all published pages for public viewing
async function getAllPublishedPages() {
  const supabase = await createDatabaseSupabaseClient()
  
  const { data: pages, error } = await supabase
    .from('documentation_pages')
    .select('id, title, slug, icon, parent_id, order_index, path, excerpt, updated_at')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching documentation pages:', error)
    return []
  }

  return (pages || []).map(mapBasicPageToPage)
}

// Get featured/recent pages
async function getFeaturedPages() {
  const supabase = await createDatabaseSupabaseClient()
  
  const { data: pages, error } = await supabase
    .from('documentation_pages')
    .select('id, title, slug, icon, excerpt, updated_at, word_count, reading_time_minutes')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('updated_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching featured pages:', error)
    return []
  }

  return (pages || []).map(mapFeaturedPageToPage)
}

export default async function DocsOverviewPage() {
  const [allPages, featuredPages] = await Promise.all([
    getAllPublishedPages(),
    getFeaturedPages()
  ])

  const rootPages = allPages.filter(page => !page.parent_id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <DocumentationSidebar 
          pages={allPages}
          baseHref="/docs"
        />

        {/* Main Content */}
        <DocsOverviewClient 
          rootPages={rootPages}
          featuredPages={featuredPages}
          allPages={allPages}
        />
      </div>
    </div>
  )
} 