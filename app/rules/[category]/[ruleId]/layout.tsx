import React from 'react';

// Define type for rule detail page props
type RuleDetailLayoutProps = {
  params: Promise<{
    category: string
    ruleId: string
  }>
  children: React.ReactNode
}

export default async function RuleDetailLayout({
  children,
  params
}: RuleDetailLayoutProps) {
  // Await the params for Next.js 15 compatibility
  const awaitedParams = await params;
  
  // No validation here - let the page component handle database lookups
  // This allows the page to show proper error states instead of 404s
  return (
    <div className="rule-detail-layout">
      {children}
    </div>
  )
}
