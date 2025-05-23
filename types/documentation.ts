// Types for the Documentation System
// Matches the database schema for comprehensive type safety

export interface DocumentationPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  icon?: string;
  cover_image?: string;
  parent_id?: string;
  path: string;
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'team';
  content_type: 'markdown' | 'rich_text' | 'template';
  template_data: Record<string, any>;
  metadata: Record<string, any>;
  author_id?: string;
  last_edited_by?: string;
  view_count: number;
  word_count: number;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface DocumentationVersion {
  id: string;
  page_id: string;
  version_number: number;
  title: string;
  content: string;
  changes_summary?: string;
  author_id?: string;
  is_major_version: boolean;
  created_at: string;
}

export interface DocumentationComment {
  id: string;
  page_id: string;
  parent_comment_id?: string;
  content: string;
  author_id: string;
  selection_start?: number;
  selection_end?: number;
  selection_text?: string;
  is_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentationPermission {
  id: string;
  page_id: string;
  user_id: string;
  permission_type: 'read' | 'comment' | 'edit' | 'admin';
  granted_by?: string;
  created_at: string;
}

export interface DocumentationLink {
  id: string;
  source_page_id: string;
  target_type: 'rule' | 'category' | 'page' | 'external';
  target_id?: string;
  target_url?: string;
  link_text: string;
  context?: string;
  created_at: string;
}

export interface DocumentationTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
}

export interface DocumentationTemplate {
  id: string;
  name: string;
  description?: string;
  content_template: string;
  template_type: 'guide' | 'api_reference' | 'tutorial' | 'concept' | 'troubleshooting';
  variables: TemplateVariable[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'number';
  label: string;
  description?: string;
  required: boolean;
  default_value?: any;
  options?: string[]; // For select type
}

export interface DocumentationBookmark {
  id: string;
  user_id: string;
  page_id: string;
  created_at: string;
}

export interface DocumentationSearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  path: string;
  rank: number;
}

export interface DocumentationBreadcrumb {
  id: string;
  title: string;
  slug: string;
  path: string;
  level: number;
}

// Extended types with relationships
export interface DocumentationPageWithRelations extends DocumentationPage {
  author?: {
    id: string;
    name?: string;
    email: string;
    avatar_url?: string;
  };
  last_editor?: {
    id: string;
    name?: string;
    email: string;
    avatar_url?: string;
  };
  children?: DocumentationPage[];
  parent?: DocumentationPage;
  tags?: DocumentationTag[];
  comments?: DocumentationCommentWithAuthor[];
  permissions?: DocumentationPermission[];
  versions?: DocumentationVersion[];
  links?: DocumentationLink[];
  breadcrumbs?: DocumentationBreadcrumb[];
  is_bookmarked?: boolean;
}

export interface DocumentationCommentWithAuthor extends DocumentationComment {
  author?: {
    id: string;
    name?: string;
    email: string;
    avatar_url?: string;
  };
  replies?: DocumentationCommentWithAuthor[];
}

// API request/response types
export interface CreateDocumentationPageRequest {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  icon?: string;
  cover_image?: string;
  parent_id?: string;
  order_index?: number;
  status?: 'draft' | 'published';
  visibility?: 'public' | 'private' | 'team';
  content_type?: 'markdown' | 'rich_text' | 'template';
  template_data?: Record<string, any>;
  metadata?: Record<string, any>;
  tag_ids?: string[];
}

export interface UpdateDocumentationPageRequest {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  icon?: string;
  cover_image?: string;
  parent_id?: string;
  order_index?: number;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'private' | 'team';
  content_type?: 'markdown' | 'rich_text' | 'template';
  template_data?: Record<string, any>;
  metadata?: Record<string, any>;
  tag_ids?: string[];
}

export interface CreateDocumentationCommentRequest {
  page_id: string;
  parent_comment_id?: string;
  content: string;
  selection_start?: number;
  selection_end?: number;
  selection_text?: string;
}

export interface UpdateDocumentationCommentRequest {
  content: string;
}

export interface DocumentationSearchParams {
  query?: string;
  tag?: string;
  author?: string;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'private' | 'team';
  content_type?: 'markdown' | 'rich_text' | 'template';
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'view_count' | 'relevance';
  sort_order?: 'asc' | 'desc';
}

export interface DocumentationListResponse {
  pages: DocumentationPageWithRelations[];
  total_count: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface DocumentationTree {
  id: string;
  title: string;
  slug: string;
  path: string;
  icon?: string;
  children: DocumentationTree[];
  order_index: number;
  status: 'draft' | 'published' | 'archived';
}

// Editor and UI types
export interface DocumentationEditorState {
  content: string;
  title: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved?: string;
  collaborators: string[];
  selection?: {
    start: number;
    end: number;
  };
}

export interface DocumentationSidebarItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: DocumentationSidebarItem[];
  level: number;
  isExpanded?: boolean;
  hasChildren: boolean;
}

export interface DocumentationTableOfContents {
  id: string;
  title: string;
  level: number;
  anchor: string;
  children: DocumentationTableOfContents[];
}

// Analytics and metrics types
export interface DocumentationAnalytics {
  total_pages: number;
  total_views: number;
  total_comments: number;
  total_contributors: number;
  top_pages: {
    id: string;
    title: string;
    path: string;
    view_count: number;
  }[];
  recent_activity: {
    type: 'page_created' | 'page_updated' | 'comment_added' | 'page_viewed';
    page_id: string;
    page_title: string;
    user_id?: string;
    user_name?: string;
    created_at: string;
  }[];
}

// Export configuration types
export interface DocumentationExportOptions {
  format: 'pdf' | 'epub' | 'html' | 'markdown' | 'docx';
  include_comments: boolean;
  include_metadata: boolean;
  page_ids?: string[];
  hierarchy?: boolean;
}

export interface DocumentationExportResult {
  download_url: string;
  file_size: number;
  expires_at: string;
  format: string;
}

// Real-time collaboration types
export interface DocumentationCollaborationEvent {
  type: 'user_joined' | 'user_left' | 'content_changed' | 'selection_changed' | 'comment_added';
  user_id: string;
  user_name?: string;
  page_id: string;
  data?: any;
  timestamp: string;
}

export interface DocumentationCollaborationState {
  active_users: {
    user_id: string;
    user_name?: string;
    avatar_url?: string;
    selection?: {
      start: number;
      end: number;
    };
    last_seen: string;
  }[];
  is_editing: boolean;
  edit_lock?: {
    user_id: string;
    user_name?: string;
    locked_at: string;
  };
} 