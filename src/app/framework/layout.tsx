import { Metadata } from 'next'

const title = 'VibeCodingRules Framework - Project-Aware AI Intelligence'
const description = 'Deploy intelligent, project-aware AI rules with one command. The VibeCodingRules framework analyzes your codebase, understands your patterns, and configures your AI assistant to work like a senior developer on your team.'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'VibeCodingRules framework',
    'CLI tool',
    'project-aware AI',
    'automated AI setup',
    'intelligent coding assistant',
    'AI context generation',
    'development automation',
    'AI-assisted programming',
    'context-aware rules',
    'systematic AI intelligence'
  ],
  openGraph: {
    title,
    description,
    type: 'website',
    images: [
      {
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
        width: 1200,
        height: 630,
        alt: 'VibeCodingRules Framework - Project-Aware AI Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`],
  },
  alternates: {
    canonical: '/framework',
  },
}

export default function FrameworkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 