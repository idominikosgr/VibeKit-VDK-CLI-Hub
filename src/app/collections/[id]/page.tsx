"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Collection, Rule } from "@/lib/types"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { CaretRight } from "@phosphor-icons/react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0
  }
}

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    async function loadCollection() {
      const collectionId = Array.isArray(params.id) ? params.id[0] : params.id
      if (!collectionId) return

      try {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: { session } } = await supabase.auth.getSession()

        // Get collection details
        const { data: collectionData, error: collectionError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', collectionId)
          .single()

        if (collectionError || !collectionData) {
          console.error('Collection error:', collectionError)
          setError('Collection not found')
          return
        }

        // Check if user is owner or if collection is public
        const userIsOwner = session?.user && collectionData.user_id === session.user.id
        const isPublic = collectionData.is_public

        if (!userIsOwner && !isPublic) {
          setError('Access denied')
          return
        }

        setIsOwner(!!userIsOwner)
        setCollection(collectionData as Collection)

        // Get collection rules
        const { data: rulesData, error: rulesError } = await supabase
          .from('collection_items')
          .select(`
            rules (
              id,
              title,
              slug,
              description,
              path,
              content,
              version,
              category_id,
              downloads,
              votes,
              tags,
              globs,
              compatibility,
              examples,
              always_apply,
              last_updated,
              created_at,
              updated_at,
              categories (
                name,
                slug
              )
            )
          `)
          .eq('collection_id', collectionId)

        if (rulesError) {
          console.error('Rules error:', rulesError)
          toast.error('Failed to load collection rules')
        } else {
          const transformedRules = (rulesData || [])
            .map(item => item.rules)
            .filter(Boolean)
            .map(rule => rule ? ({
              ...rule,
              categoryName: rule.categories?.name,
              categorySlug: rule.categories?.slug
            }) : null)
            .filter(Boolean) as Rule[]

          setRules(transformedRules)
        }
      } catch (error) {
        console.error('Error loading collection:', error)
        setError('Failed to load collection')
      } finally {
        setLoading(false)
      }
    }

    loadCollection()
  }, [params.id])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 bg-gradient-to-r from-muted via-muted/60 to-muted rounded-lg"></div>
            <div className="h-4 w-1/2 bg-gradient-to-r from-muted via-muted/60 to-muted rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="h-32 w-full bg-gradient-to-r from-muted via-muted/60 to-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error || !collection) {
    return (
      <div className="container mx-auto py-10">
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center shadow-lg mb-6">
            <Icons.alertTriangle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{error}</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-md leading-relaxed">
            {error === 'Collection not found' 
              ? 'The collection you are looking for does not exist or has been deleted.'
              : 'You do not have permission to view this collection.'
            }
          </p>
          <Button onClick={() => router.push('/collections')}>
            <Icons.chevronRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Collections
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      {/* Breadcrumb */}
      <motion.div 
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/collections" className="hover:text-foreground transition-colors">
          Collections
        </Link>
        <CaretRight className="w-4 h-4" />
        <span className="text-foreground">{collection.name}</span>
      </motion.div>

      {/* Collection header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
            <p className="text-muted-foreground text-lg">
              {collection.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {collection.is_public && (
              <Badge variant="secondary">Public</Badge>
            )}
            {isOwner && (
              <Badge variant="outline">Owner</Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icons.code className="h-4 w-4" />
            {rules.length} {rules.length === 1 ? 'rule' : 'rules'}
          </span>
          {collection.created_at && (
            <span className="flex items-center gap-1">
              <Icons.settings className="h-4 w-4" />
              Created {new Date(collection.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </motion.div>

      {/* Rules grid */}
      {rules.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-lg mb-6">
            <Icons.folder className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No rules yet</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-md leading-relaxed">
            This collection is empty. {isOwner ? 'Add some rules to get started.' : 'Check back later for updates.'}
          </p>
          {isOwner && (
            <Button onClick={() => router.push('/rules')}>
              <Icons.search className="mr-2 h-4 w-4" />
              Browse Rules
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {rules.map((rule) => (
            <motion.div key={rule.id} variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-card/80 to-muted/60 backdrop-blur-sm border-2 border-border/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1">{rule.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {rule.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rule.categoryName && (
                      <Badge variant="outline" className="text-xs">
                        {rule.categoryName}
                      </Badge>
                    )}
                    {rule.tags && rule.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rule.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {rule.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{rule.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/rules/${rule.categorySlug || 'uncategorized'}/${rule.id}`}>
                      View Rule
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
} 