import { notFound } from 'next/navigation'
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client'
import { DocumentationViewer } from '@/components/documentation/DocumentationViewer'
import { DocumentationBreadcrumbs } from '@/components/documentation/DocumentationBreadcrumbs'
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Get documentation page by slug
async function getDocumentationPage(slug: string) {
  const supabase = await createDatabaseSupabaseClient()
  
  const { data: page, error } = await supabase
    .from('documentation_pages')
    .select(`
      *,
      children:documentation_pages!parent_id(id, title, slug, status, icon, excerpt, order_index),
      parent:documentation_pages!parent_id(id, title, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .single()

  if (error) {
    console.error('Error fetching documentation page:', error)
    return null
  }

  return page
}

// Get all published pages for sidebar
async function getAllPages() {
  const supabase = await createDatabaseSupabaseClient()
  
  const { data: pages, error } = await supabase
    .from('documentation_pages')
    .select('id, title, slug, icon, parent_id, order_index, path')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching pages:', error)
    return []
  }

  return pages || []
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getDocumentationPage(slug)

  if (!page) {
    return {
      title: 'Page Not Found - Documentation',
    }
  }

  return {
    title: `${page.title} - Documentation`,
    description: page.excerpt || `Learn about ${page.title} in our comprehensive documentation.`,
    openGraph: {
      title: `${page.title} - Documentation`,
      description: page.excerpt || `Learn about ${page.title} in our comprehensive documentation.`,
      type: 'article',
    },
  }
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug } = await params
  const [page, allPages] = await Promise.all([
    getDocumentationPage(slug),
    getAllPages()
  ])

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <DocumentationSidebar 
          pages={allPages}
          currentPageId={page.id}
          baseHref="/docs"
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-background/30 overflow-hidden">
          {/* Breadcrumbs */}
          <DocumentationBreadcrumbs 
            pageId={page.id}
            currentPage={{
              id: page.id,
              title: page.title,
              slug: page.slug,
              path: page.path
            }}
          />

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <DocumentationViewer 
              page={{
                id: page.id,
                title: page.title,
                content: page.content,
                icon: page.icon,
                cover_image: page.cover_image,
                excerpt: page.excerpt,
                word_count: page.word_count,
                reading_time_minutes: page.reading_time_minutes,
                created_at: page.created_at,
                updated_at: page.updated_at,
                children: Array.isArray(page.children) ? page.children : []
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 