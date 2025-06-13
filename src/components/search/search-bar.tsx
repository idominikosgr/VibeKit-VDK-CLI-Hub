"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

interface MagnifyingGlassBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onMagnifyingGlass?: (query: string) => void;
}

export function MagnifyingGlassBar({ 
  placeholder = "MagnifyingGlass...", 
  className = "", 
  defaultValue = "",
  onMagnifyingGlass
}: MagnifyingGlassBarProps) {
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

  // Update the search query in the URL or call the onMagnifyingGlass handler
  const handleMagnifyingGlass = (term: string) => {
    setQuery(term);

    // If custom onMagnifyingGlass handler is provided, use it
    if (onMagnifyingGlass) {
      onMagnifyingGlass(term);
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
    if (onMagnifyingGlass) {
      onMagnifyingGlass(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleMagnifyingGlass(e.target.value)}
        className="pr-10"
        disabled={isPending}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {isPending ? (
          <Icons.loader className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </form>
  );
}
