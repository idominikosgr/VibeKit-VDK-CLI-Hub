"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ 
  placeholder = "Search...", 
  className = "", 
  defaultValue = "",
  onSearch
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get the current search query from URL parameters or the provided defaultValue
  const currentQuery = defaultValue || searchParams.get("q") || "";
  const [query, setQuery] = useState(currentQuery);

  // Update the query state when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

  // Update the search query in the URL or call the onSearch handler
  const handleSearch = (term: string) => {
    setQuery(term);

    // If custom onSearch handler is provided, use it
    if (onSearch) {
      onSearch(term);
      return;
    }

    // Otherwise update the URL with the search parameter
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pr-10"
        disabled={isPending}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {isPending ? (
          <Icons.loader className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Icons.search className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </form>
  );
}
