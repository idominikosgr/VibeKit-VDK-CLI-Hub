"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CollectionCard } from "@/components/collections/collection-card"
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog"
import { Icons } from "@/components/icons"
import { Collection } from "@/lib/types"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
}

export default function CollectionsPage() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth error:', error)
        return
      }

      if (session?.user) {
        setIsAuthenticated(true)
        setCurrentUser(session.user)
      } else {
        setIsAuthenticated(false)
        setCurrentUser(null)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true)
        setCurrentUser(session.user)
        loadCollections() // Reload collections when user signs in
      } else {
        setIsAuthenticated(false)
        setCurrentUser(null)
        setCollections([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load collections
  const loadCollections = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Get user's collections with rule count
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_items (
            id,
            rule_id,
            rules (
              id,
              title,
              slug
            )
          )
        `)
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading collections:', error)
        toast.error('Failed to load collections')
        return
      }

      // Transform data to include rules array
      const transformedCollections = (data || []).map(collection => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        user_id: collection.user_id,
        is_public: collection.is_public,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
        rules: (collection.collection_items?.length || 0) > 0 ? [] : undefined // Simplified for now
      } as Collection))

      setCollections(transformedCollections)
    } catch (error) {
      console.error('Error loading collections:', error)
      toast.error('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  // Load collections when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadCollections()
    }
  }, [isAuthenticated, currentUser])

  // Filter collections based on search query
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCollectionCreated = (newCollection: Collection) => {
    setCollections(prev => [newCollection, ...prev])
  }

  const handleCollectionDeleted = () => {
    loadCollections() // Reload to get fresh data
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10">
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg mb-6">
            <Icons.user className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-md leading-relaxed">
            Create collections to organize your favorite rules and access them anytime.
          </p>
          <Button onClick={() => router.push('/auth/login')} size="lg">
            <Icons.login className="mr-2 h-5 w-5" />
            Sign In
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">My Collections</h1>
          <p className="text-muted-foreground">
            Organize and manage your favorite rules
          </p>
        </div>
        <CreateCollectionDialog onCollectionCreated={handleCollectionCreated} />
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative mb-8"
      >
        <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {/* Loading state */}
      {loading && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="animate-pulse space-y-4"
            >
              <div className="h-48 w-full bg-gradient-to-r from-muted via-muted/60 to-muted rounded-lg"></div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No collections state */}
      {!loading && filteredCollections.length === 0 && (
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-lg mb-6">
            <Icons.folder className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {searchQuery ? 'No collections found' : 'No collections yet'}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-md leading-relaxed">
            {searchQuery 
              ? 'Try adjusting your search terms.'
              : 'Create your first collection to start organizing your favorite rules.'
            }
          </p>
          {!searchQuery && (
            <CreateCollectionDialog 
              onCollectionCreated={handleCollectionCreated}
              trigger={
                <Button size="lg">
                  <Icons.userPlus className="mr-2 h-5 w-5" />
                  Create First Collection
                </Button>
              }
            />
          )}
        </motion.div>
      )}

      {/* Collections grid */}
      {!loading && filteredCollections.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCollections.map((collection) => (
            <motion.div key={collection.id} variants={itemVariants}>
              <CollectionCard
                collection={collection}
                onDelete={handleCollectionDeleted}
                isOwner={true}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
