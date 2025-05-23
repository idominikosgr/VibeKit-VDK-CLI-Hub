export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          added_at: string | null
          email: string
        }
        Insert: {
          added_at?: string | null
          email: string
        }
        Update: {
          added_at?: string | null
          email?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          name: string
          order_index: number | null
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          added_at: string | null
          collection_id: string | null
          id: string
          rule_id: string | null
        }
        Insert: {
          added_at?: string | null
          collection_id?: string | null
          id?: string
          rule_id?: string | null
        }
        Update: {
          added_at?: string | null
          collection_id?: string | null
          id?: string
          rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      documentation_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          page_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_bookmarks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_resolved: boolean | null
          page_id: string | null
          parent_comment_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          selection_end: number | null
          selection_start: number | null
          selection_text: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          page_id?: string | null
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          selection_end?: number | null
          selection_start?: number | null
          selection_text?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          page_id?: string | null
          parent_comment_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          selection_end?: number | null
          selection_start?: number | null
          selection_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_comments_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentation_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "documentation_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_links: {
        Row: {
          context: string | null
          created_at: string | null
          id: string
          link_text: string
          source_page_id: string | null
          target_id: string | null
          target_type: string
          target_url: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          id?: string
          link_text: string
          source_page_id?: string | null
          target_id?: string | null
          target_type: string
          target_url?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          id?: string
          link_text?: string
          source_page_id?: string | null
          target_id?: string | null
          target_type?: string
          target_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_links_source_page_id_fkey"
            columns: ["source_page_id"]
            isOneToOne: false
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_page_tags: {
        Row: {
          page_id: string
          tag_id: string
        }
        Insert: {
          page_id: string
          tag_id: string
        }
        Update: {
          page_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentation_page_tags_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentation_page_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "documentation_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_pages: {
        Row: {
          author_id: string | null
          content: string
          content_type: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          icon: string | null
          id: string
          last_edited_by: string | null
          metadata: Json | null
          order_index: number | null
          parent_id: string | null
          path: string
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          status: string | null
          template_data: Json | null
          title: string
          updated_at: string | null
          view_count: number | null
          visibility: string | null
          word_count: number | null
        }
        Insert: {
          author_id?: string | null
          content?: string
          content_type?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          icon?: string | null
          id?: string
          last_edited_by?: string | null
          metadata?: Json | null
          order_index?: number | null
          parent_id?: string | null
          path: string
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          status?: string | null
          template_data?: Json | null
          title: string
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
          word_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          content_type?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          icon?: string | null
          id?: string
          last_edited_by?: string | null
          metadata?: Json | null
          order_index?: number | null
          parent_id?: string | null
          path?: string
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          status?: string | null
          template_data?: Json | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_permissions: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          page_id: string | null
          permission_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          page_id?: string | null
          permission_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          page_id?: string | null
          permission_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_permissions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_search_cache: {
        Row: {
          content_hash: string | null
          id: string
          page_id: string | null
          search_vector: unknown | null
          updated_at: string | null
        }
        Insert: {
          content_hash?: string | null
          id?: string
          page_id?: string | null
          search_vector?: unknown | null
          updated_at?: string | null
        }
        Update: {
          content_hash?: string | null
          id?: string
          page_id?: string | null
          search_vector?: unknown | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_search_cache_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: true
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation_tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      documentation_templates: {
        Row: {
          content_template: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          template_type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content_template: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template_type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content_template?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      documentation_versions: {
        Row: {
          author_id: string | null
          changes_summary: string | null
          content: string
          created_at: string | null
          id: string
          is_major_version: boolean | null
          page_id: string | null
          title: string
          version_number: number
        }
        Insert: {
          author_id?: string | null
          changes_summary?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_major_version?: boolean | null
          page_id?: string | null
          title: string
          version_number: number
        }
        Update: {
          author_id?: string | null
          changes_summary?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_major_version?: boolean | null
          page_id?: string | null
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "documentation_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "documentation_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_packages: {
        Row: {
          configuration_id: string | null
          created_at: string | null
          download_count: number | null
          download_url: string | null
          expires_at: string | null
          file_size: number | null
          id: string
          package_type: string
          rule_count: number | null
        }
        Insert: {
          configuration_id?: string | null
          created_at?: string | null
          download_count?: number | null
          download_url?: string | null
          expires_at?: string | null
          file_size?: number | null
          id?: string
          package_type: string
          rule_count?: number | null
        }
        Update: {
          configuration_id?: string | null
          created_at?: string | null
          download_count?: number | null
          download_url?: string | null
          expires_at?: string | null
          file_size?: number | null
          id?: string
          package_type?: string
          rule_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_packages_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "wizard_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          output_format: string
          template_content: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          output_format: string
          template_content: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          output_format?: string
          template_content?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          github_username: string | null
          id: string
          name: string | null
          preferred_language: string | null
          preferred_theme: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          github_username?: string | null
          id: string
          name?: string | null
          preferred_language?: string | null
          preferred_theme?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          github_username?: string | null
          id?: string
          name?: string | null
          preferred_language?: string | null
          preferred_theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rule_compatibility: {
        Row: {
          compatibility_type: string | null
          created_at: string | null
          id: string
          notes: string | null
          rule_id: string | null
          technology: string
          version_pattern: string | null
        }
        Insert: {
          compatibility_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          rule_id?: string | null
          technology: string
          version_pattern?: string | null
        }
        Update: {
          compatibility_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          rule_id?: string | null
          technology?: string
          version_pattern?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_compatibility_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["id"]
          },
        ]
      }
      rule_dependencies: {
        Row: {
          condition_tags: Json | null
          created_at: string | null
          dependency_type: string | null
          depends_on_rule_id: string | null
          id: string
          rule_id: string | null
        }
        Insert: {
          condition_tags?: Json | null
          created_at?: string | null
          dependency_type?: string | null
          depends_on_rule_id?: string | null
          id?: string
          rule_id?: string | null
        }
        Update: {
          condition_tags?: Json | null
          created_at?: string | null
          dependency_type?: string | null
          depends_on_rule_id?: string | null
          id?: string
          rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_dependencies_depends_on_rule_id_fkey"
            columns: ["depends_on_rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rule_dependencies_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["id"]
          },
        ]
      }
      rule_versions: {
        Row: {
          changes: string | null
          content: string
          created_at: string | null
          id: string
          rule_id: string | null
          version: string
        }
        Insert: {
          changes?: string | null
          content: string
          created_at?: string | null
          id?: string
          rule_id?: string | null
          version: string
        }
        Update: {
          changes?: string | null
          content?: string
          created_at?: string | null
          id?: string
          rule_id?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "rule_versions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["id"]
          },
        ]
      }
      rules: {
        Row: {
          always_apply: boolean | null
          category_id: string
          compatibility: Json | null
          content: string
          created_at: string | null
          description: string
          downloads: number | null
          examples: Json | null
          globs: string[] | null
          id: string
          last_updated: string | null
          path: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          version: string
          votes: number | null
        }
        Insert: {
          always_apply?: boolean | null
          category_id: string
          compatibility?: Json | null
          content: string
          created_at?: string | null
          description: string
          downloads?: number | null
          examples?: Json | null
          globs?: string[] | null
          id: string
          last_updated?: string | null
          path: string
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          version?: string
          votes?: number | null
        }
        Update: {
          always_apply?: boolean | null
          category_id?: string
          compatibility?: Json | null
          content?: string
          created_at?: string | null
          description?: string
          downloads?: number | null
          examples?: Json | null
          globs?: string[] | null
          id?: string
          last_updated?: string | null
          path?: string
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          version?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          added_count: number | null
          created_at: string | null
          duration_ms: number | null
          error_count: number | null
          errors: Json | null
          id: string
          sync_type: string
          updated_count: number | null
        }
        Insert: {
          added_count?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_count?: number | null
          errors?: Json | null
          id?: string
          sync_type: string
          updated_count?: number | null
        }
        Update: {
          added_count?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_count?: number | null
          errors?: Json | null
          id?: string
          sync_type?: string
          updated_count?: number | null
        }
        Relationships: []
      }
      user_votes: {
        Row: {
          created_at: string | null
          id: string
          rule_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rule_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rule_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_votes_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_configurations: {
        Row: {
          created_at: string | null
          custom_requirements: string | null
          environment_details: Json
          generated_rules: string[] | null
          generation_timestamp: string | null
          id: string
          language_choices: Json
          output_format: string | null
          session_id: string | null
          stack_choices: Json
          tool_preferences: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_requirements?: string | null
          environment_details: Json
          generated_rules?: string[] | null
          generation_timestamp?: string | null
          id?: string
          language_choices: Json
          output_format?: string | null
          session_id?: string | null
          stack_choices: Json
          tool_preferences: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_requirements?: string | null
          environment_details?: Json
          generated_rules?: string[] | null
          generation_timestamp?: string | null
          id?: string
          language_choices?: Json
          output_format?: string | null
          session_id?: string | null
          stack_choices?: Json
          tool_preferences?: Json
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_reading_time: {
        Args: { content: string }
        Returns: number
      }
      generate_documentation_path: {
        Args: { page_id: string }
        Returns: string
      }
      get_documentation_breadcrumbs: {
        Args: { page_id: string }
        Returns: {
          id: string
          title: string
          slug: string
          path: string
          level: number
        }[]
      }
      get_popular_rules: {
        Args: { limit_count?: number }
        Returns: {
          always_apply: boolean | null
          category_id: string
          compatibility: Json | null
          content: string
          created_at: string | null
          description: string
          downloads: number | null
          examples: Json | null
          globs: string[] | null
          id: string
          last_updated: string | null
          path: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          version: string
          votes: number | null
        }[]
      }
      get_rules_by_category: {
        Args: { category_slug: string }
        Returns: {
          always_apply: boolean | null
          category_id: string
          compatibility: Json | null
          content: string
          created_at: string | null
          description: string
          downloads: number | null
          examples: Json | null
          globs: string[] | null
          id: string
          last_updated: string | null
          path: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          version: string
          votes: number | null
        }[]
      }
      get_table_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          row_count: number
          size_bytes: number
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_rule_downloads: {
        Args: { target_rule_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      remove_rule_vote: {
        Args: { target_rule_id: string }
        Returns: undefined
      }
      search_documentation: {
        Args: {
          search_query: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          slug: string
          excerpt: string
          path: string
          rank: number
        }[]
      }
      search_rules: {
        Args: { search_query: string; category_slug?: string; tags?: string[] }
        Returns: {
          always_apply: boolean | null
          category_id: string
          compatibility: Json | null
          content: string
          created_at: string | null
          description: string
          downloads: number | null
          examples: Json | null
          globs: string[] | null
          id: string
          last_updated: string | null
          path: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          version: string
          votes: number | null
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      vote_for_rule: {
        Args: { target_rule_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

