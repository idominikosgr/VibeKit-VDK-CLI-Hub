"use client"

import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  view: "cards" | "details"
  onViewChange: (view: "cards" | "details") => void
  className?: string
}

export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex items-center gap-1 rounded-md border bg-background p-1", className)}>
      <Button
        variant={view === "cards" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("cards")}
        className="h-7 px-2"
        aria-label="Card view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "details" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("details")}
        className="h-7 px-2"
        aria-label="Detail view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
} 