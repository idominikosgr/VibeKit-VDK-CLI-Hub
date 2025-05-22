import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { getRuleCategories, searchRules, getAllRules } from "@/lib/services/supabase-rule-service"
import { SearchBar } from "@/components/search/search-bar"
import { CategoryGridSkeleton } from '@/components/ui/loading'
import { RuleCategory, Rule } from '@/lib/types'
import { AlertCircle } from 'lucide-react'


interface RulesCatalogPageProps {
  searchParams?: { q?: string; tab?: string };
}

export default async function RulesCatalogPage({ searchParams }: RulesCatalogPageProps) {
  // Access searchParams after awaiting it
  const params = await searchParams;
  const searchQuery = params?.q || "";
  const tab = params?.tab || "categories";

  // Fetch categories from Supabase
  let categories: RuleCategory[] = [];
  let rules: Rule[] = [];
  let error = null;

  try {
    // Use the supabase-rule-service implementation
    categories = await getRuleCategories();
    console.log(`Loaded ${categories.length} categories from Supabase`);

    // If we're on the rules tab, fetch rules
    if (tab === "rules") {
      if (searchQuery) {
        // Search for specific rules
        const rulesResult = await searchRules(searchQuery, 1, 50);
        rules = rulesResult.data;
        console.log(`Loaded ${rules.length} rules from search: "${searchQuery}"`);
      } else {
        // Get all rules
        const rulesResult = await getAllRules(1, 50);
        rules = rulesResult.data;
        console.log(`Loaded ${rules.length} rules from Supabase (all rules)`);
      }
    }
  } catch (err) {
    console.error('Failed to fetch data:', err);
    error = 'Failed to load data. Please try again.';
  }

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "code": return <Icons.code className="h-4 w-4" />;
      case "tasks": return <Icons.tasks className="h-4 w-4" />;
      case "settings": return <Icons.settings className="h-4 w-4" />;
      case "brain": return <Icons.brain className="h-4 w-4" />;
      case "layers": return <Icons.code className="h-4 w-4" />; // Fallback to code icon
      case "tool": return <Icons.settings className="h-4 w-4" />; // Use settings icon instead
      case "robot": return <Icons.logo className="h-4 w-4" />; // Use logo icon instead
      default: return <Icons.code className="h-4 w-4" />;
    }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-bold tracking-tight lg:text-5xl">
            Rules Catalog
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse our comprehensive collection of AI-assisted development rules and guidelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/setup">
            <Button>
              <Icons.settings className="mr-2 h-4 w-4" />
              Setup Wizard
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue={tab} className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="categories" asChild>
              <Link href="/rules?tab=categories">Categories</Link>
            </TabsTrigger>
            <TabsTrigger value="rules" asChild>
              <Link href="/rules?tab=rules">All Rules</Link>
            </TabsTrigger>
          </TabsList>
          <div className="w-full max-w-sm">
            <SearchBar
              placeholder={tab === "rules" ? "Search rules..." : "Search categories..."}
            />
          </div>
        </div>

        {error ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-2xl font-bold mb-2">Failed to load data</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" asChild>
              <Link href="/rules">Try Again</Link>
            </Button>
          </div>
        ) : (
          <>
            <TabsContent value="categories">
              {categories.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categories.map((category) => (
                    <Link href={`/rules/${category.slug}`} key={category.id}>
                      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            {getIconComponent(category.icon || 'code')}
                            <CardTitle>{category.title || category.name}</CardTitle>
                          </div>
                          <CardDescription>{category.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <p className="text-sm text-muted-foreground">
                            {category.count} {category.count === 1 ? 'rule' : 'rules'}
                          </p>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <CategoryGridSkeleton count={8} />
              )}
            </TabsContent>

            <TabsContent value="rules">
              {rules.length > 0 ? (
                <div className="space-y-6">
                  {rules.map((rule) => (
                    <Card key={rule.id} className="overflow-hidden transition-colors hover:bg-muted/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">
                              <Link 
                                href={`/rules/${rule.categorySlug || 'core'}/${rule.id}`}
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
                          Version {rule.version} • Category: {rule.categoryName}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/rules/${rule.categorySlug || 'core'}/${rule.id}`}>
                            View Rule
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : tab === "rules" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No rules found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `No rules match "${searchQuery}".`
                      : 'No rules available at the moment.'
                    }
                  </p>
                  {searchQuery && (
                    <Button variant="outline" asChild>
                      <Link href="/rules?tab=rules">Clear Search</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <CategoryGridSkeleton count={8} />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Featured Rule Collections</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Next.js Enterprise Stack</CardTitle>
              <CardDescription>Complete guidelines for Next.js with server components, Supabase, and more</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/collections/nextjs-enterprise">
                <Button variant="outline" size="sm">View Collection</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Modern Swift & SwiftUI</CardTitle>
              <CardDescription>Comprehensive rules for Swift 5.9/6.0, SwiftUI, and SwiftData</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/collections/modern-swift">
                <Button variant="outline" size="sm">View Collection</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Development Tools</CardTitle>
              <CardDescription>Memory management, sequential thinking, and AI workflow integration</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/collections/ai-tools">
                <Button variant="outline" size="sm">View Collection</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
