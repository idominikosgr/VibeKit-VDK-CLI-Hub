import { MetadataRoute } from 'next'
import { getRuleCategories, getAllRules } from '@/lib/services/supabase-rule-service'
import { RuleCategory, Rule } from '@/lib/types'

export async function generateSitemaps() {
  // Generate multiple sitemaps for large rule sets
  const rulesResult = await getAllRules(1, 1000)
  const totalRules = rulesResult.data.length
  const sitemapsNeeded = Math.ceil(totalRules / 500) // 500 URLs per sitemap
  
  return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hub.vibecodingrules.rocks'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hub`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rules`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/setup`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contribute`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/license`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Dynamic category routes
    const categories: RuleCategory[] = await getRuleCategories()
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category: RuleCategory) => ({
      url: `${baseUrl}/rules/${category.slug}`,
      lastModified: new Date(category.updated_at || category.created_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic rule routes - paginated based on sitemap ID
    const startIndex = id * 500
    const rulesResult = await getAllRules(1, 1000) // Get all rules
    const paginatedRules = rulesResult.data.slice(startIndex, startIndex + 500)
    
    const ruleRoutes: MetadataRoute.Sitemap = paginatedRules.map((rule: Rule) => ({
      url: `${baseUrl}/rules/${rule.categorySlug}/${rule.slug || rule.id}`,
      lastModified: new Date(rule.updated_at || rule.created_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Include static routes only in the first sitemap
    if (id === 0) {
      return [...staticRoutes, ...categoryRoutes, ...ruleRoutes]
    }
    
    return ruleRoutes
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static routes on error for first sitemap
    return id === 0 ? staticRoutes : []
  }
} 