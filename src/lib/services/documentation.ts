import { DocumentPage, DocumentPageWithChildren, CreatePageRequest, UpdatePageRequest } from '@/types/documentation'
import { SerializedEditorState } from 'lexical'

class DocumentationService {
  private baseUrl = '/api/docs'

  private async handleResponse(response: Response, operation: string) {
    if (!response.ok) {
      let errorMessage = `Failed to ${operation}`
      
      try {
        const errorData = await response.json()
        if (errorData.error) {
          errorMessage = errorData.error
        }
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`
        }
      } catch {
        // If we can't parse the error response, use status-based messages
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please sign in to continue.'
        } else if (response.status === 403) {
          errorMessage = 'Access denied. You do not have permission to perform this action.'
        } else if (response.status === 404) {
          errorMessage = 'Page not found'
        } else if (response.status >= 500) {
          errorMessage = 'Database error. Please try again later.'
        }
      }
      
      throw new Error(errorMessage)
    }
  }

  async getAllPages(includeChildren = false): Promise<DocumentPageWithChildren[]> {
    const url = includeChildren 
      ? `${this.baseUrl}?include_children=true` 
      : this.baseUrl
    
    const response = await fetch(url, {
      credentials: 'include'
    })
    
    await this.handleResponse(response, 'fetch pages')
    
    const data = await response.json()
    return data.pages || []
  }

  async getPagesByParent(parentId?: string): Promise<DocumentPage[]> {
    const url = parentId 
      ? `${this.baseUrl}?parent_id=${parentId}` 
      : this.baseUrl
    
    const response = await fetch(url, {
      credentials: 'include'
    })
    
    await this.handleResponse(response, 'fetch pages')
    
    const data = await response.json()
    return data.pages || []
  }

  async getPage(id: string): Promise<DocumentPage> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      credentials: 'include'
    })
    
    await this.handleResponse(response, 'fetch page')
    
    const data = await response.json()
    return data.page
  }

  async createPage(request: CreatePageRequest): Promise<DocumentPage> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    await this.handleResponse(response, 'create page')

    const data = await response.json()
    return data.page
  }

  async updatePage(id: string, request: UpdatePageRequest): Promise<DocumentPage> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    await this.handleResponse(response, 'update page')

    const data = await response.json()
    return data.page
  }

  async updatePageContent(id: string, content: SerializedEditorState): Promise<DocumentPage> {
    return this.updatePage(id, { content })
  }

  async updatePageTitle(id: string, title: string): Promise<DocumentPage> {
    return this.updatePage(id, { title })
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<DocumentPage> {
    return this.updatePage(id, { is_favorite: isFavorite })
  }

  async publishPage(id: string, isPublished: boolean): Promise<DocumentPage> {
    return this.updatePage(id, { is_published: isPublished })
  }

  async deletePage(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    await this.handleResponse(response, 'delete page')
  }

  async searchPages(query: string): Promise<DocumentPage[]> {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
      credentials: 'include'
    })
    
    await this.handleResponse(response, 'search pages')
    
    const data = await response.json()
    return data.pages || []
  }

  // Helper method to build tree structure from flat array
  buildTree(pages: DocumentPage[]): DocumentPageWithChildren[] {
    const pageMap = new Map<string, DocumentPageWithChildren>()
    const rootPages: DocumentPageWithChildren[] = []

    // First pass: create all pages with empty children arrays
    pages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] })
    })

    // Second pass: build the tree structure
    pages.forEach(page => {
      const pageWithChildren = pageMap.get(page.id)!
      if (page.parent_id && pageMap.has(page.parent_id)) {
        const parent = pageMap.get(page.parent_id)!
        parent.children.push(pageWithChildren)
      } else {
        rootPages.push(pageWithChildren)
      }
    })

    // Sort by position at each level
    const sortByPosition = (pages: DocumentPageWithChildren[]) => {
      pages.sort((a, b) => a.position - b.position)
      pages.forEach(page => sortByPosition(page.children))
    }

    sortByPosition(rootPages)
    return rootPages
  }
}

export const documentationService = new DocumentationService() 