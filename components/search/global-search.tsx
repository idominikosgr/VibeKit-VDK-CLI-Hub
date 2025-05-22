"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Icons } from "@/components/icons"

import { searchRules } from "@/lib/services/supabase-rule-service"
import { Rule, SearchResult } from "@/lib/types"

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
        try {
          setIsLoading(true)
          const searchResults = await searchRules(query)
          setResults(searchResults)
        } catch (error) {
          console.error("Error searching rules:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSelect = (item: Rule) => {
    setOpen(false)
    router.push(`/rules/${item.category_id}/${item.id}`)
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
                {results.map((item) => (
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
                ))}
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
      </CommandDialog>
    </>
  )
}
