// Simplified types for the new Notion-like Documentation System
import { SerializedEditorState } from 'lexical'

// Core page interface
export interface DocumentPage {
  id: string
  title: string
  content: SerializedEditorState | string
  icon?: string
  cover?: string
  parent_id?: string
  position: number
  is_published: boolean
  is_favorite: boolean
  created_at: string
  updated_at: string
  created_by: string
  last_edited_by: string
}

// Page with nested children for tree structure
export interface DocumentPageWithChildren extends DocumentPage {
  children: DocumentPageWithChildren[]
}

// Breadcrumb trail
export interface Breadcrumb {
  id: string
  title: string
  icon?: string
}

// MagnifyingGlass result
export interface MagnifyingGlassResult {
  id: string
  title: string
  content_preview: string
  icon?: string
  url: string
  highlights?: string[]
}

// User info for collaboration
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// API request types
export interface CreatePageRequest {
  title: string
  parent_id?: string
  icon?: string
  content?: SerializedEditorState | string
}

export interface UpdatePageRequest {
  title?: string
  content?: SerializedEditorState | string
  icon?: string
  cover?: string
  is_published?: boolean
  is_favorite?: boolean
}

export interface MovePageRequest {
  parent_id?: string
  position: number
}

// Tree structure for sidebar
export interface PageTreeItem {
  id: string
  title: string
  icon?: string
  children: PageTreeItem[]
  is_expanded: boolean
  has_children: boolean
} 