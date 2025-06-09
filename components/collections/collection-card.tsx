"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Collection } from "@/lib/types"
import { toast } from "sonner"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CollectionCardProps {
  collection: Collection
  onDelete?: () => void
  isOwner?: boolean
}

export function CollectionCard({ collection, onDelete, isOwner }: CollectionCardProps) {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!isOwner || !onDelete) return

    try {
      setIsDeleting(true)
      
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collection.id)

      if (error) {
        console.error('Error deleting collection:', error)
        toast.error('Failed to delete collection')
        return
      }

      toast.success('Collection deleted successfully')
      onDelete()
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Failed to delete collection')
    } finally {
      setIsDeleting(false)
    }
  }

  const ruleCount = collection.rules?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full bg-gradient-to-br from-card/80 to-muted/60 backdrop-blur-sm border-2 border-border/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="line-clamp-1">{collection.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {collection.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-1">
              {collection.is_public && (
                <Badge variant="secondary" className="text-xs">
                  Public
                </Badge>
              )}
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  {isDeleting ? (
                    <Icons.loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.alertTriangle className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.code className="h-4 w-4" />
            <span>
              {ruleCount} {ruleCount === 1 ? 'rule' : 'rules'}
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button asChild className="w-full">
            <Link href={`/collections/${collection.id}`}>
              <Icons.folder className="mr-2 h-4 w-4" />
              View Collection
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 