import React from 'react';

// Define type for rule detail page props
type RuleDetailLayoutProps = {
  params: {
    category: string
    ruleId: string
  }
  children: React.ReactNode
}

export default function RuleDetailLayout({
  children,
  params
}: RuleDetailLayoutProps) {
  // No validation here - let the page component handle database lookups
  // This allows the page to show proper error states instead of 404s
  return (
    <div className="rule-detail-layout">
      {children}
    </div>
  )
}
