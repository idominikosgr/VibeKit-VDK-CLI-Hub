'use client'

import { useState, useEffect, useRef } from 'react'
import { PlusIcon, MagnifyingGlassIcon, StarIcon, DotsThreeIcon, FileTextIcon, FolderIcon, CircleNotchIcon, SignInIcon, UserPlusIcon, TrashIcon, CheckIcon, ClockIcon } from "@phosphor-icons/react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AdvancedPencilSimple } from '@/components/blocks/advanced-editor'
import { DocumentPage, DocumentPageWithChildren, CreatePageRequest } from '@/types/documentation'
import { SerializedEditorState } from 'lexical'
import { documentationService } from '@/lib/services/documentation'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth/auth-provider'
import Link from 'next/link'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface SidebarItemProps {
  page: DocumentPageWithChildren
  level: number
  isSelected: boolean
  onSelect: (page: DocumentPageWithChildren) => void
  onCreateChild: (parentId: string) => void
  onDelete: (pageId: string) => void
  user: any
  selectedPageId: string | null
}

function SidebarItem({ page, level, isSelected, onSelect, onCreateChild, onDelete, user, selectedPageId }: SidebarItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const hasChildren = page.children.length > 0

  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-150 group ${
          isSelected 
            ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary shadow-sm' 
            : 'hover:bg-muted/50 text-foreground/80 hover:text-foreground'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className={`w-4 h-4 flex items-center justify-center rounded transition-colors ${
              isExpanded ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FolderIcon className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-3' : ''}`} />
          </button>
        )}
        
        {!hasChildren && (
          <div className="w-4 h-4 flex items-center justify-center">
            <FileTextIcon className="w-3 h-3 text-muted-foreground" />
          </div>
        )}

        {/* Page Content */}
        <button
          onClick={() => onSelect(page)}
          className="flex-1 flex items-center gap-2 text-left min-w-0"
        >
          <span className="text-sm">{page.icon || '📄'}</span>
          <span className="text-sm font-medium truncate">{page.title}</span>
        </button>

        {/* Options Menu */}
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowOptions(!showOptions)
            }}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-background/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <DotsThreeIcon className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Options Dropdown */}
      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowOptions(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 w-44 bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg z-20">
            {user ? (
              <>
                <button
                  onClick={() => {
                    onCreateChild(page.id)
                    setShowOptions(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2 first:rounded-t-lg"
                >
                  <PlusIcon className="w-3 h-3" />
                  Add child page
                </button>
                <div className="h-px bg-border/50 mx-2" />
                <button
                  onClick={() => {
                    onDelete(page.id)
                    setShowOptions(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/5 transition-colors flex items-center gap-2 last:rounded-b-lg"
                >
                  <TrashIcon className="w-3 h-3" />
                  Delete page
                </button>
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                <SignInIcon className="w-3 h-3" />
                Sign in to edit
              </div>
            )}
          </div>
        </>
      )}

      {/* Child Pages */}
      {isExpanded && hasChildren && (
        <div className="mt-1 space-y-1">
          {page.children.map((child) => (
            <SidebarItem
              key={child.id}
              page={child}
              level={level + 1}
              isSelected={selectedPageId === child.id}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
              user={user}
              selectedPageId={selectedPageId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DocsEditPage() {
  const [pages, setPages] = useState<DocumentPageWithChildren[]>([])
  const [selectedPage, setSelectedPage] = useState<DocumentPageWithChildren | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useAuth()

  // Load pages function
  const loadPages = async () => {
    try {
      setIsLoading(true)
      const pagesData = await documentationService.getAllPages(true)
      setPages(pagesData)
      
      // Select first page by default
      if (pagesData.length > 0 && !selectedPage) {
        setSelectedPage(pagesData[0])
      }
    } catch (error) {
      console.error('Failed to load pages:', error)
      toast.error('Failed to load documentation pages')
    } finally {
      setIsLoading(false)
    }
  }

  // Load pages on mount
  useEffect(() => {
    loadPages()
  }, [])

  // Reset save status when page changes
  useEffect(() => {
    setSaveStatus('saved')
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = null
    }
  }, [selectedPage?.id])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleCreatePage = async (parentId?: string) => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to create a documentation page')
      return
    }

    try {
      const newPageRequest: CreatePageRequest = {
        title: 'Untitled',
        parent_id: parentId,
        icon: '📄',
      }

      const newPage = await documentationService.createPage(newPageRequest)
      
      // Reload pages to get updated tree structure
      const updatedPages = await documentationService.getAllPages(true)
      setPages(updatedPages)
      
      // Find and select the new page
      const findPageInTree = (pages: DocumentPageWithChildren[], id: string): DocumentPageWithChildren | null => {
        for (const page of pages) {
          if (page.id === id) return page
          const found = findPageInTree(page.children, id)
          if (found) return found
        }
        return null
      }
      
      const createdPage = findPageInTree(updatedPages, newPage.id)
      if (createdPage) {
        setSelectedPage(createdPage)
      }

      toast.success('Page created successfully')
    } catch (error) {
      console.error('Failed to create page:', error)
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        toast.error('Please sign in to create a page')
      } else {
        toast.error('Failed to create page')
      }
    }
  }

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return
    }

    try {
      await documentationService.deletePage(pageId)
      
      // If deleted page was selected, clear selection
      if (selectedPage?.id === pageId) {
        setSelectedPage(null)
      }
      
      // Reload pages
      await loadPages()

      toast.success('Page deleted successfully')
    } catch (error) {
      console.error('Failed to delete page:', error)
      toast.error('Failed to delete page')
    }
  }

  const handleContentChange = async (content: SerializedEditorState) => {
    if (!selectedPage) return

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set unsaved status and show saving after a short delay
    setSaveStatus('unsaved')
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving')
        await documentationService.updatePageContent(selectedPage.id, content)
        
        // Update local state
        setSelectedPage(prev => prev ? { ...prev, content } : null)
        setSaveStatus('saved')
        
        // Auto-hide "saved" status after 2 seconds
        setTimeout(() => {
          setSaveStatus('saved')
        }, 2000)
      } catch (error) {
        console.error('Failed to save content:', error)
        setSaveStatus('error')
        toast.error('Failed to save content')
        
        // Reset to unsaved after error
        setTimeout(() => {
          setSaveStatus('unsaved')
        }, 3000)
      }
    }, 1000) // Debounce for 1 second
  }

  const handleTitleChange = async (title: string) => {
    if (!selectedPage || title === selectedPage.title) return

    try {
      setIsSaving(true)
      await documentationService.updatePageTitle(selectedPage.id, title)
      
      // Update local state
      setSelectedPage(prev => prev ? { ...prev, title } : null)
      
      // Reload pages to update sidebar
      await loadPages()
    } catch (error) {
      console.error('Failed to save title:', error)
      toast.error('Failed to save title')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!selectedPage) return

    try {
      const newFavoriteState = !selectedPage.is_favorite
      await documentationService.toggleFavorite(selectedPage.id, newFavoriteState)
      
      // Update local state
      setSelectedPage(prev => prev ? { ...prev, is_favorite: newFavoriteState } : null)
      
      toast.success(newFavoriteState ? 'Added to favorites' : 'Removed from favorites')
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      toast.error('Failed to update favorite status')
    }
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <CircleNotchIcon className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading documentation editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-card/80 backdrop-blur-sm border-r border-border/50 flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <FileTextIcon className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-semibold text-foreground">Edit Documentation</h1>
              </div>
              {user && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCreatePage()}
                  className="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-background/50 border-border/50 focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Pages List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <SidebarItem
                    key={page.id}
                    page={page}
                    level={0}
                    isSelected={selectedPage?.id === page.id}
                    onSelect={setSelectedPage}
                    onCreateChild={handleCreatePage}
                    onDelete={handleDeletePage}
                    user={user}
                    selectedPageId={selectedPage?.id || null}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileTextIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm font-medium mb-1">No pages found</p>
                  <p className="text-xs">Try adjusting your search</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-border/30">
            <Link href="/docs" className="block mb-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-background/50 hover:bg-background/80 border-border/50"
              >
                ← Back to Documentation
              </Button>
            </Link>
            {!user && (
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <UserPlusIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Ready to contribute?</p>
                    <p className="text-xs text-muted-foreground">Sign in to create and edit pages</p>
                  </div>
                </div>
                <Link href="/auth/login" className="block">
                  <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <SignInIcon className="w-3 h-3 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-background/30">
          {selectedPage ? (
            <>
              {/* Page Header */}
              <div className="bg-card/60 backdrop-blur-sm border-b border-border/30 px-8 py-6 shadow-sm">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{selectedPage.icon || '📄'}</span>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="text-3xl font-bold bg-transparent border-none outline-none flex-1 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 rounded-md px-2 py-1"
                      placeholder="Untitled"
                      disabled={isSaving || !user}
                    />
                    {isSaving && <CircleNotchIcon className="w-5 h-5 animate-spin text-primary" />}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                      Last edited {new Date(selectedPage.updated_at).toLocaleDateString()}
                    </span>
                    
                    {/* Save Status Indicator */}
                    <div className="flex items-center gap-2">
                      {saveStatus === 'saving' && (
                        <>
                          <CircleNotchIcon className="w-3 h-3 animate-spin text-primary" />
                          <span className="text-primary">Saving...</span>
                        </>
                      )}
                      {saveStatus === 'saved' && (
                        <>
                          <CheckIcon className="w-3 h-3 text-green-500" />
                          <span className="text-green-500">Saved</span>
                        </>
                      )}
                      {saveStatus === 'unsaved' && (
                        <>
                          <ClockIcon className="w-3 h-3 text-yellow-500" />
                          <span className="text-yellow-500">Unsaved changes</span>
                        </>
                      )}
                      {saveStatus === 'error' && (
                        <>
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-red-500">Save failed</span>
                        </>
                      )}
                    </div>

                    {user && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-3 hover:bg-primary/5 hover:text-primary transition-colors" 
                        onClick={handleToggleFavorite}
                      >
                        <StarIcon className={`w-3 h-3 mr-2 ${selectedPage.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        {selectedPage.is_favorite ? 'Favorited' : 'Add to favorites'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-8 py-8">
                  <AdvancedPencilSimple
                    editorSerializedState={selectedPage.content as SerializedEditorState}
                    onSerializedChange={handleContentChange}
                    placeholder="Start writing your documentation..."
                    className="bg-card/40 backdrop-blur-sm border-border/30 shadow-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto px-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FileTextIcon className="w-10 h-10 text-primary/70" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Documentation Editor</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Create and organize your team's knowledge base. Select a page from the sidebar to get started, or create your first documentation page.
                </p>
                {user ? (
                  <Button 
                    onClick={() => handleCreatePage()}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create your first page
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Link href="/auth/login">
                      <Button 
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transition-all duration-200 transform hover:scale-105"
                        size="lg"
                      >
                        <UserPlusIcon className="w-4 h-4 mr-2" />
                        Sign in to edit
                      </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Join our community to contribute to the documentation
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 