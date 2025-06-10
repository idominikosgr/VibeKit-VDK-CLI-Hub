import React, { Suspense } from "react"
import { CategoryGridSkeleton } from '@/components/ui/loading'
import { RulesCatalogClient } from './rules-catalog-client'

export default function RulesCatalogPage() {
  return (
    <Suspense fallback={<CategoryGridSkeleton count={8} />}>
      <RulesCatalogClient />
    </Suspense>
  )
}
