import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MagnifyingGlassBar } from "@/components/search/search-bar"
import { Rule, RuleCategory, PaginatedResult } from "@/lib/types"
import { ExclamationTriangleIcon, CodeIcon } from "@radix-ui/react-icons"
import { getCategory, getRulesByCategory } from "@/lib/services/supabase-rule-service"

// Disable static generation to fix createContext build error
export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>;
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Await the params and searchParams for Next.js 15+
  const awaitedParams = await params;
  const awaitedMagnifyingGlassParams = await searchParams;
  
  const categorySlug = awaitedParams.category;
  const searchQuery = awaitedMagnifyingGlassParams?.q || '';
  const currentPage = awaitedMagnifyingGlassParams?.page ? parseInt(awaitedMagnifyingGlassParams.page, 10) : 1;

  try {
    // Fetch category data
    const category = await getCategory(categorySlug);
    
    if (!category) {
      notFound();
    }

    // Fetch rules for the category
    const rulesResult = await getRulesByCategory(
      categorySlug, 
      currentPage, 
      20, 
      searchQuery || undefined
    );

    return (
      <div className="container py-10">
        <div className="flex flex-col gap-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/rules" className="hover:text-foreground">
              Rules
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.title}</span>
          </div>

          {/* Category header */}
          <div>
            <div className="flex items-center gap-2">
              <CodeIcon className="h-5 w-5" />
              <h1 className="text-3xl font-bold">{category.title}</h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">{category.description}</p>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="w-full max-w-md">
              <MagnifyingGlassBar 
                placeholder="Search rules..." 
                defaultValue={searchQuery}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {rulesResult.pagination.totalCount} {rulesResult.pagination.totalCount === 1 ? 'rule' : 'rules'}
            </div>
          </div>

          {/* Rules list */}
          {rulesResult.data.length > 0 ? (
            <>
              <div className="space-y-6">
                {rulesResult.data.map((rule) => (
                  <Card key={rule.id} className="overflow-hidden transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            <Link 
                              href={`/rules/${categorySlug}/${rule.id}`}
                              className="hover:text-primary"
                            >
                              {rule.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {rule.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{rule.votes} votes</span>
                          <span>•</span>
                          <span>{rule.downloads} downloads</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {rule.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Version {rule.version}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/rules/${categorySlug}/${rule.id}`}>
                          View Rule
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {rulesResult.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    {/* Pagination navigation */}
                    {currentPage > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/rules/${categorySlug}?${new URLSearchParams({
                          ...(searchQuery && { q: searchQuery }),
                          page: (currentPage - 1).toString()
                        }).toString()}`}>
                          Previous
                        </Link>
                      </Button>
                    )}
                    
                    <span className="px-4 py-2 text-sm">
                      Page {currentPage} of {rulesResult.pagination.totalPages}
                    </span>
                    
                    {currentPage < rulesResult.pagination.totalPages && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/rules/${categorySlug}?${new URLSearchParams({
                          ...(searchQuery && { q: searchQuery }),
                          page: (currentPage + 1).toString()
                        }).toString()}`}>
                          Next
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ExclamationTriangleIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No rules found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No rules match "${searchQuery}" in this category.`
                  : 'This category doesn\'t have any rules yet.'
                }
              </p>
              {searchQuery && (
                <Button variant="outline" asChild>
                  <Link href={`/rules/${categorySlug}`}>Clear MagnifyingGlass</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to load category</h2>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href={`/rules/${categorySlug}`}>Try Again</Link>
            </Button>
            <Button asChild>
              <Link href="/rules">Browse All Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
