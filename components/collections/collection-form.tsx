"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createCollection, updateCollection } from "@/lib/services/collection-service"
import { Collection } from "@/lib/types"

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(1000, "Description is too long"),
  isPublic: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface CollectionFormProps {
  userId: string
  collection?: Collection
}

export function CollectionForm({ userId, collection }: CollectionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!collection

  // Initialize form with default or existing values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection?.name || "",
      description: collection?.description || "",
      isPublic: collection?.isPublic || false,
    },
  })

  // Form submission handler
  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      if (isEditing && collection) {
        // Update existing collection
        const result = await updateCollection(
          {
            id: collection.id,
            ...values,
          },
          userId
        )

        if (result) {
          toast.success("Collection updated")
          router.push(`/collections/${collection.id}`)
          router.refresh()
        } else {
          toast.error("Failed to update collection")
        }
      } else {
        // Create new collection
        const result = await createCollection(
          {
            name: values.name,
            description: values.description,
            isPublic: values.isPublic,
            userId,
            rules: []
          },
          userId
        )

        if (result) {
          toast.success("Collection created")
          router.push(`/collections/${result.id}`)
          router.refresh()
        } else {
          toast.error("Failed to create collection")
        }
      }
    } catch (error) {
      console.error("Error saving collection:", error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Collection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of your collection"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Collection</FormLabel>
                    <FormDescription>
                      Make this collection visible to other users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/collections')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? 'Update' : 'Create'} Collection
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
