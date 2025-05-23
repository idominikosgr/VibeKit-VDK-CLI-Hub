'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CreateDocumentationDialog } from './create-documentation-dialog';
import { 
  Edit3, 
  Save, 
  X, 
  Eye, 
  Calendar, 
  User, 
  Clock, 
  Tag,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Home,
  Globe,
  Users,
  Lock,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { 
  DocumentationPageWithRelations, 
  DocumentationTag, 
  DocumentationTemplate,
  CreateDocumentationPageRequest
} from '@/types/documentation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EnhancedDocumentationPageProps {
  page: DocumentationPageWithRelations;
  isAdmin?: boolean;
  initialEditMode?: boolean;
  onUpdatePage?: (id: string, updates: Partial<DocumentationPageWithRelations>) => Promise<DocumentationPageWithRelations>;
  onCreatePage?: (data: CreateDocumentationPageRequest) => Promise<DocumentationPageWithRelations>;
  onDeletePage?: (id: string) => Promise<{ redirect?: string }>;
  tags?: DocumentationTag[];
  templates?: DocumentationTemplate[];
  parentPages?: Array<{ id: string; title: string; path: string }>;
  categories?: Array<{ id: string; name: string }>;
}

export function EnhancedDocumentationPage({
  page,
  isAdmin = false,
  initialEditMode = false,
  onUpdatePage,
  onCreatePage,
  onDeletePage,
  tags = [],
  templates = [],
  parentPages = [],
  categories = [],
}: EnhancedDocumentationPageProps) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editedContent, setEditedContent] = useState(page.content);
  const [editedTitle, setEditedTitle] = useState(page.title);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setEditedContent(page.content);
    setEditedTitle(page.title);
    setIsEditing(initialEditMode);
  }, [page.content, page.title, initialEditMode]);

  const handleSave = async () => {
    if (!onUpdatePage || !isAdmin) return;
    
    setIsSaving(true);
    try {
      await onUpdatePage(page.id, {
        content: editedContent,
        title: editedTitle,
        last_edited_by: 'current-user', // This should be the actual user ID
      });
      setIsEditing(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(page.content);
    setEditedTitle(page.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDeletePage || !isAdmin) return;
    
    setIsDeleting(true);
    try {
      const result = await onDeletePage(page.id);
      if (result.redirect) {
        window.location.href = result.redirect;
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAutoSave = async () => {
    if (!onUpdatePage || !isAdmin) return;
    
    try {
      await onUpdatePage(page.id, {
        content: editedContent,
        last_edited_by: 'current-user',
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error auto-saving page:', error);
    }
  };

  const getVisibilityIcon = () => {
    switch (page.visibility) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* Breadcrumbs */}
        {page.breadcrumbs && page.breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
            {page.breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center space-x-1">
                <a 
                  href={`/docs/${crumb.slug}`}
                  className="hover:text-gray-700 transition-colors"
                >
                  {crumb.title}
                </a>
                {index < page.breadcrumbs!.length - 1 && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Title Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {page.icon && (
                <span className="text-3xl">{page.icon}</span>
              )}
              <div className="flex-1">
                {isEditing && isAdmin ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-3xl font-bold border-none outline-none bg-transparent w-full"
                    placeholder="Page title..."
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                {getVisibilityIcon()}
                <span className="capitalize">{page.visibility}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{page.view_count} views</span>
              </div>
              
              {page.reading_time_minutes > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{page.reading_time_minutes} min read</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {formatDistanceToNow(new Date(page.updated_at))} ago</span>
              </div>

              {page.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={page.author.avatar_url} />
                    <AvatarFallback>{page.author.name?.[0] || page.author.email[0]}</AvatarFallback>
                  </Avatar>
                  <span>{page.author.name || page.author.email}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {page.tags && page.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Tag className="h-4 w-4 text-gray-400" />
                {page.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {page.excerpt && (
              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                {page.excerpt}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {isAdmin && (
              <>
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                )}

                <CreateDocumentationDialog
                  onCreatePage={onCreatePage!}
                  tags={tags}
                  templates={templates}
                  parentPages={parentPages}
                  categories={categories}
                  isAdmin={isAdmin}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View History</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate Page</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Delete Page
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Documentation Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{page.title}"? This action cannot be undone and will permanently remove the page and all its comments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete Page'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {page.cover_image && (
          <div className="mb-8">
            <img
              src={page.cover_image}
              alt={`Cover for ${page.title}`}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        <Separator />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              {isEditing && isAdmin ? (
                <RichTextEditor
                  content={editedContent}
                  onChange={setEditedContent}
                  isAdmin={isAdmin}
                  autoSave={true}
                  onSave={handleAutoSave}
                  autoSaveInterval={10000} // Auto-save every 10 seconds
                  className="min-h-[400px]"
                />
              ) : (
                <RichTextEditor
                  content={page.content}
                  onChange={() => {}} // Read-only for non-admin
                  isAdmin={false}
                  editable={false}
                  className="border-none shadow-none"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Table of Contents */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Contents
              </h3>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                {/* This would be dynamically generated from content headings */}
                <div className="text-gray-500">
                  Table of contents will appear here based on page headings
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Child Pages */}
          {page.children && page.children.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold">Child Pages</h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {page.children.map((child) => (
                    <a
                      key={child.id}
                      href={`/docs/${child.slug}`}
                      className="block p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {child.icon && <span className="text-sm">{child.icon}</span>}
                        <span className="text-sm font-medium">{child.title}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          {page.comments && page.comments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({page.comments.length})
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {page.comments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={comment.author?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {comment.author?.name?.[0] || comment.author?.email[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-xs">
                          {comment.author?.name || comment.author?.email}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                  {page.comments.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      View all comments
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Last Saved Status */}
          {lastSaved && isAdmin && (
            <div className="text-xs text-gray-500 text-center">
              Last saved {formatDistanceToNow(lastSaved)} ago
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 