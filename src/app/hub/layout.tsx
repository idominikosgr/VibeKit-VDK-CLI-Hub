import { Metadata } from 'next'

const title = 'VibeCodingRules Framework - Intelligent AI-Assisted Development'
const description = 'Revolutionize your AI coding experience with our comprehensive framework. Get intelligent, context-aware coding rules that understand your project stack, enhance AI assistant performance, and boost development productivity.'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'AI coding assistant',
    'intelligent development',
    'context-aware rules',
    'VibeCodingRules',
    'productivity framework',
    'AI-assisted programming',
    'development automation',
    'coding productivity',
    'intelligent IDE',
    'project-aware AI'
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
        alt: 'VibeCodingRules Framework - Intelligent AI-Assisted Development',
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
    canonical: '/hub',
  },
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 