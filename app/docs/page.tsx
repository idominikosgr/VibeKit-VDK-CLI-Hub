import { Suspense } from 'react';
import { Metadata } from 'next/types';
import { CreateDocumentationDialog } from '@/components/docs/create-documentation-dialog';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { getCurrentUser } from '@/lib/services/auth-service';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Search,
  FileText,
  Users,
  Globe,
  Lock,
  Calendar,
  Eye,
  Plus,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { DocumentationListResponse, CreateDocumentationPageRequest } from '@/types/documentation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getCurrentUserAdminStatus } from '@/lib/middleware/admin-auth';

export const metadata: Metadata = {
  title: 'Documentation - CodePilotRules Hub',
  description: 'Comprehensive documentation for CodePilotRules Hub, covering app architecture, agentic AI concepts, and development workflows.',
};

async function getDocumentationPages(): Promise<DocumentationListResponse> {
  try {
    return await documentationServiceServer.searchPages({
      status: 'published',
      visibility: 'public',
      limit: 50,
      sort_by: 'updated_at',
      sort_order: 'desc'
    });
  } catch (error) {
    console.error('Error fetching documentation pages:', error);
    return {
      pages: [],
      total_count: 0,
      limit: 50,
      offset: 0,
      has_more: false
    };
  }
}

async function isUserAdmin(): Promise<boolean> {
  try {
    const { isAdmin } = await getCurrentUserAdminStatus();
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

function getVisibilityIcon(visibility: string) {
  switch (visibility) {
    case 'public':
      return <Globe className="h-4 w-4" />;
    case 'team':
      return <Users className="h-4 w-4" />;
    case 'private':
      return <Lock className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}

export default async function DocumentationHomePage() {
  const [documentationData, isAdmin] = await Promise.all([
    getDocumentationPages(),
    isUserAdmin()
  ]);

  const [tags, templates] = await Promise.all([
    documentationServiceServer.getTags().catch(() => []),
    Promise.resolve([]), // Add template service later
  ]);

  const handleCreatePage = async (data: CreateDocumentationPageRequest) => {
    'use server';
    try {
      return await documentationServiceServer.createPage(data);
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  };

  const handleDeletePage = async (pageId: string) => {
    'use server';
    try {
      const response = await fetch(`/api/docs/${pageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete page');
      // Redirect to refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Documentation</h1>
              <p className="text-lg text-gray-600">
                Comprehensive guides, API references, and development resources
              </p>
            </div>
            
            {isAdmin && (
              <CreateDocumentationDialog
                onCreatePage={handleCreatePage}
                tags={tags}
                templates={templates}
                isAdmin={isAdmin}
              />
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documentation..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              All Pages ({documentationData.total_count})
            </Button>
          </div>

          <Separator />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentationData.total_count}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documentationData.pages.reduce((sum, page) => sum + (page.view_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(documentationData.pages.map(page => page.author_id).filter(Boolean)).size}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {documentationData.pages[0] 
                  ? formatDistanceToNow(new Date(documentationData.pages[0].updated_at)) + ' ago'
                  : 'Never'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Pages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Pages</h2>
          
          {documentationData.pages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documentation pages yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first documentation page.
                </p>
                {isAdmin && (
                  <CreateDocumentationDialog
                    onCreatePage={handleCreatePage}
                    tags={tags}
                    templates={templates}
                    isAdmin={isAdmin}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {documentationData.pages.map((page) => (
                <Card key={page.id} className="hover:shadow-md transition-shadow group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {page.icon && (
                            <span className="text-2xl">{page.icon}</span>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl">
                                <Link 
                                  href={`/docs/${page.slug}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {page.title}
                                </Link>
                              </CardTitle>
                              
                              {/* CRUD Action Buttons */}
                              {isAdmin && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem asChild>
                                        <Link href={`/docs/${page.slug}?edit=true`} className="flex items-center gap-2">
                                          <Edit className="h-4 w-4" />
                                          Edit Page
                                        </Link>
                                      </DropdownMenuItem>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem 
                                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                                            onSelect={(e) => e.preventDefault()}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Page
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Page</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete "{page.title}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                              onClick={() => handleDeletePage(page.id)}
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                            {page.excerpt && (
                              <CardDescription className="mt-2">
                                {page.excerpt}
                              </CardDescription>
                            )}
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            {getVisibilityIcon(page.visibility)}
                            <span className="capitalize">{page.visibility}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{page.view_count || 0} views</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Updated {formatDistanceToNow(new Date(page.updated_at))} ago</span>
                          </div>

                          {page.author && (
                            <div className="flex items-center gap-1">
                              <span>by {page.author.name || page.author.email}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {page.tags && page.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {page.tags.map((tag) => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                          {page.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {documentationData.has_more && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Pages
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 