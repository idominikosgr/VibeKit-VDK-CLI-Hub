"use client"

// FIXED: Global search component with proper handling of paginated search results
// to prevent serialization errors when passing data from server to client components

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Icons } from "@/components/icons"

import { Rule, PaginatedResult } from "@/lib/types"

type GlobalSearchProps = {
  shortcutKey?: string
}

export function GlobalSearch({ shortcutKey = "k" }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Rule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Debug logs
  console.log('🔍 GlobalSearch state:', { query, resultsCount: results.length, isLoading, open })

  // Debug results changes
  useEffect(() => {
    console.log('📊 Results state changed:', results.length, 'items:', results.map(r => r.title))
  }, [results])

  // Debug loading state changes
  useEffect(() => {
    console.log('⏳ Loading state changed:', isLoading)
  }, [isLoading])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === shortcutKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [shortcutKey])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
    }
  }, [open])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        const controller = new AbortController()
        try {
          setIsLoading(true)
          console.log('🚀 Starting search for:', query)
          
          // Add timeout to see if request is hanging
          const timeoutId = setTimeout(() => {
            console.log('⏰ Request timeout - aborting')
            controller.abort()
          }, 10000) // 10 second timeout
          
          const response = await fetch(`/api/rules/search?q=${encodeURIComponent(query)}&pageSize=10`, {
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          console.log('📡 Response status:', response.status, response.ok)
          
          if (!response.ok) {
            throw new Error(`Search failed with status: ${response.status}`)
          }
          
          const searchResults: PaginatedResult<Rule> = await response.json()
          console.log('📄 Search results:', searchResults)
          console.log('📊 Results data:', searchResults.data?.length, 'items')
          
          if (searchResults.data) {
            setResults(searchResults.data)
            console.log('✅ Results set in state')
          } else {
            console.log('⚠️ No data property in results')
            setResults([])
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('🛑 Request was aborted')
          } else {
            console.error("❌ Error searching rules:", error)
          }
          setResults([])
        } finally {
          setIsLoading(false)
          console.log('🏁 Search finished, loading set to false')
        }
      } else {
        setResults([])
        console.log('🧹 Query too short, cleared results')
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSelect = (item: Rule) => {
    setOpen(false)
    const categoryPath = item.categorySlug || item.category_id
    router.push(`/rules/${categoryPath}/${item.id}`)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Icons.search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search rules...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder="Search across all rules..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length < 2 && (
              <CommandEmpty>Enter at least 2 characters to search</CommandEmpty>
            )}
            {query.length >= 2 && isLoading && (
              <div className="py-6 text-center text-sm">
                <Icons.spinner className="mx-auto h-6 w-6 animate-spin text-primary" />
                <p className="mt-2">Searching rules...</p>
              </div>
            )}
            {query.length >= 2 && !isLoading && results.length === 0 && (
              <CommandEmpty>No results found</CommandEmpty>
            )}
            {results.length > 0 && (
              <>
                <CommandGroup heading="Rules">
                  {results.map((item) => {
                    console.log('📝 Rendering item:', item.id, item.title)
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center gap-2"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.categoryName || item.category_id} • {item.path.split("/").pop()}
                          </span>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      router.push(`/rules?q=${encodeURIComponent(query)}`)
                    }}
                  >
                    <Icons.search className="mr-2 h-4 w-4" />
                    Show all results
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
