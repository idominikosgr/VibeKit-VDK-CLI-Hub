import React from 'react';
import { Metadata } from 'next'
import { getRule } from '@/lib/services/supabase-rule-service'
import { notFound } from 'next/navigation'
import { RuleStructuredData } from '@/components/structured-data'

// Define type for rule detail page props
type RuleDetailLayoutProps = {
  params: Promise<{
    category: string
    ruleId: string
  }>
  children: React.ReactNode
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; ruleId: string }>
}): Promise<Metadata> {
  try {
    const { category, ruleId } = await params
    const rule = await getRule(ruleId)

    if (!rule) {
      return {
        title: 'Rule Not Found',
        description: 'The requested coding rule could not be found.',
      }
    }

    const title = `${rule.title} | VibeCodingRules`
    const description = rule.description || `Learn about ${rule.title} - a comprehensive coding rule for better development practices.`
    const canonicalUrl = `https://hub.vibecodingrules.rocks/rules/${category}/${ruleId}`

    return {
      title,
      description,
      keywords: [
        rule.title,
        'coding rules',
        'development best practices',
        'AI assistant',
        rule.categoryName || category,
        ...(rule.tags || []),
      ],
      authors: [{ name: 'VibeCodingRules Team' }],
      creator: 'VibeCodingRules',
      publisher: 'VibeCodingRules Hub',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: rule.created_at || undefined,
        modifiedTime: rule.updated_at || undefined,
        section: rule.categoryName || category,
        tags: rule.tags || undefined,
        images: [
          {
            url: `/og?title=${encodeURIComponent(rule.title)}&description=${encodeURIComponent(
              description
            )}&theme=rule`,
            width: 1200,
            height: 630,
            alt: `${rule.title} - VibeCodingRules`,
          },
        ],
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [
          `/og?title=${encodeURIComponent(rule.title)}&description=${encodeURIComponent(
            description
          )}&theme=rule`,
        ],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata for rule:', error)
    return {
      title: 'VibeCodingRules',
      description: 'AI-assisted development rules and guidelines',
    }
  }
}

export default async function RuleDetailLayout({
  children,
  params
}: RuleDetailLayoutProps) {
  try {
    const { category, ruleId } = await params
    const rule = await getRule(ruleId)

    if (!rule) {
      return (
        <div className="rule-detail-layout">
          {children}
        </div>
      )
    }

    const canonicalUrl = `https://hub.vibecodingrules.rocks/rules/${category}/${ruleId}`

    return (
      <div className="rule-detail-layout">
        {children}
        <RuleStructuredData
          title={rule.title}
          description={rule.description || `Learn about ${rule.title}`}
          url={canonicalUrl}
          datePublished={rule.created_at || undefined}
          dateModified={rule.updated_at || undefined}
          category={rule.categoryName || category}
          tags={rule.tags || []}
        />
      </div>
    )
  } catch (error) {
    console.error('Error in RuleDetailLayout:', error)
    return (
      <div className="rule-detail-layout">
        {children}
      </div>
    )
  }
}
