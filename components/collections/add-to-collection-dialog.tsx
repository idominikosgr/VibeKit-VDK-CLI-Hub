"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Collection, Rule } from "@/lib/types"
import { CreateCollectionDialog } from "./create-collection-dialog"

interface AddToCollectionDialogProps {
  rule: Rule
  trigger?: React.ReactNode
}

export function AddToCollectionDialog({ rule, trigger }: AddToCollectionDialogProps) {
  const supabase = createBrowserSupabaseClient()
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication and load collections when dialog opens
  useEffect(() => {
    if (!open) return

    async function loadData() {
      setLoading(true)

      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      setIsAuthenticated(true)

      try {
        // Load user collections
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', session.user.id)
          .order('name')

        if (collectionsError) {
          console.error('Error loading collections:', collectionsError)
          toast.error('Failed to load collections')
          return
        }

        setCollections(collectionsData as Collection[])

        // Check which collections already contain this rule
        const { data: existingItems, error: itemsError } = await supabase
          .from('collection_items')
          .select('collection_id')
          .eq('rule_id', rule.id)
          .in('collection_id', collectionsData.map(c => c.id))

        if (!itemsError && existingItems) {
          setSelectedCollections(new Set(existingItems.map(item => item.collection_id).filter((id): id is string => id !== null)))
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load collections')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [open, rule.id])

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add rules to collections')
      return
    }

    try {
      setLoading(true)

      // Get current items for this rule
      const { data: currentItems, error: currentError } = await supabase
        .from('collection_items')
        .select('collection_id')
        .eq('rule_id', rule.id)

      if (currentError) {
        console.error('Error getting current items:', currentError)
        toast.error('Failed to update collections')
        return
      }

      const currentCollectionIds = new Set(currentItems?.map(item => item.collection_id).filter((id): id is string => id !== null) || [])

      // Determine which collections to add to and remove from
      const toAdd = Array.from(selectedCollections).filter(id => !currentCollectionIds.has(id))
      const toRemove = Array.from(currentCollectionIds).filter(id => !selectedCollections.has(id))

      // Add to new collections
      if (toAdd.length > 0) {
        const { error: addError } = await supabase
          .from('collection_items')
          .insert(toAdd.map(collectionId => ({
            collection_id: collectionId,
            rule_id: rule.id
          })))

        if (addError) {
          console.error('Error adding to collections:', addError)
          toast.error('Failed to add rule to some collections')
          return
        }
      }

      // Remove from collections
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('collection_items')
          .delete()
          .eq('rule_id', rule.id)
          .in('collection_id', toRemove)

        if (removeError) {
          console.error('Error removing from collections:', removeError)
          toast.error('Failed to remove rule from some collections')
          return
        }
      }

      toast.success('Collections updated successfully')
      setOpen(false)
    } catch (error) {
      console.error('Error updating collections:', error)
      toast.error('Failed to update collections')
    } finally {
      setLoading(false)
    }
  }

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId)
      } else {
        newSet.add(collectionId)
      }
      return newSet
    })
  }

  const handleNewCollection = (newCollection: Collection) => {
    setCollections(prev => [...prev, newCollection])
    setSelectedCollections(prev => new Set([...prev, newCollection.id]))
    toast.success('Collection created and rule added')
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Icons.userPlus className="mr-2 h-4 w-4" />
      Add to Collection
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
            <DialogDescription>
              Choose which collections to add "{rule.title}" to.
            </DialogDescription>
          </DialogHeader>

          {!isAuthenticated ? (
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please sign in to add rules to collections.
              </p>
              <Button onClick={() => setOpen(false)}>
                Sign In
              </Button>
            </div>
          ) : loading ? (
            <div className="py-6 flex items-center justify-center">
              <Icons.loader className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {collections.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    You don't have any collections yet.
                  </p>
                  <CreateCollectionDialog 
                    onCollectionCreated={handleNewCollection}
                    trigger={
                      <Button>
                        <Icons.userPlus className="mr-2 h-4 w-4" />
                        Create First Collection
                      </Button>
                    }
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {collections.map((collection) => (
                      <div
                        key={collection.id}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleCollection(collection.id)}
                      >
                        <Checkbox
                          id={collection.id}
                          checked={selectedCollections.has(collection.id)}
                          onChange={() => toggleCollection(collection.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={collection.id}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {collection.name}
                          </label>
                          {collection.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {collection.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <CreateCollectionDialog 
                      onCollectionCreated={handleNewCollection}
                      trigger={
                        <Button variant="outline" size="sm" className="w-full">
                          <Icons.userPlus className="mr-2 h-4 w-4" />
                          Create New Collection
                        </Button>
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {isAuthenticated && collections.length > 0 && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Collections'
                )}
              </Button>
            </DialogFooter>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 