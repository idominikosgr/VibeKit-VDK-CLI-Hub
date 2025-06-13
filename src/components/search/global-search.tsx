"use client"

// FIXED: Global search component with proper handling of paginated search results
// to prevent serialization errors when passing data from server to client components

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Icons } from "@/components/icons"

import { Rule, PaginatedResult } from "@/lib/types"

type GlobalMagnifyingGlassProps = {
  shortcutKey?: string
}

export function GlobalMagnifyingGlass({ shortcutKey = "k" }: GlobalMagnifyingGlassProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Rule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

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
          
          // Add timeout to see if request is hanging
          const timeoutId = setTimeout(() => {
            controller.abort()
          }, 10000) // 10 second timeout
          
          const response = await fetch(`/api/rules/search?q=${encodeURIComponent(query)}&pageSize=10`, {
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            throw new Error(`MagnifyingGlass failed with status: ${response.status}`)
          }
          
          const searchResults: PaginatedResult<Rule> = await response.json()
          
          if (searchResults.data) {
            setResults(searchResults.data)
          } else {
            setResults([])
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error("Error searching rules:", error)
          }
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
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
        className="relative h-9 w-full justify-start rounded-md text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-primary/20 dark:border-purple-700/30 hover:bg-primary/10 dark:hover:bg-purple-800/30 transition-all duration-300 hover:border-primary/40 dark:hover:border-purple-600/50 hover:shadow-md group"
        onClick={() => setOpen(true)}
        style={{
          boxShadow: `
            0 4px 12px rgba(139, 92, 246, 0.1),
            0 0 0 1px rgba(139, 92, 246, 0.05),
            inset 0 1px 2px rgba(255, 255, 255, 0.1)
          `
        }}
      >
        <Icons.search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search rules...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border border-primary/20 bg-primary/10 backdrop-blur-sm px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
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
