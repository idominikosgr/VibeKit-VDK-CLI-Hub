import { Suspense } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import { EnhancedDocumentationPage } from '@/components/docs/enhanced-documentation-page';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { getCurrentUserAdminStatus } from '@/lib/middleware/admin-auth';
import { LoadingSpinner } from '@/components/ui/loading';
import type { DocumentationPageWithRelations, CreateDocumentationPageRequest, UpdateDocumentationPageRequest } from '@/types/documentation';

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ edit?: string }>;
}

async function getDocumentationPage(slug: string): Promise<DocumentationPageWithRelations | null> {
  try {
    return await documentationServiceServer.getPage(slug, true);
  } catch (error) {
    console.error('Error fetching documentation page:', error);
    return null;
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug[slug.length - 1];
  
  const page = await getDocumentationPage(pageSlug);
  
  if (!page) {
    return {
      title: 'Page Not Found - CodePilotRules Hub',
      description: 'The requested documentation page could not be found.',
    };
  }

  return {
    title: `${page.title} - CodePilotRules Hub Documentation`,
    description: page.excerpt || `Learn about ${page.title} in the CodePilotRules Hub documentation.`,
    openGraph: {
      title: page.title,
      description: page.excerpt || undefined,
      images: page.cover_image ? [page.cover_image] : undefined,
    },
  };
}

export default async function DocumentationPageView({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { edit } = await searchParams;
  const pageSlug = slug[slug.length - 1]; // Get the last part of the slug
  
  const page = await getDocumentationPage(pageSlug);
  
  if (!page) {
    notFound();
  }

  const isAdmin = await isUserAdmin();
  const isEditMode = edit === 'true' && isAdmin;

  // Get additional data for the enhanced page
  const [tags, templates, parentPages] = await Promise.all([
    documentationServiceServer.getTags().catch(() => []),
    Promise.resolve([]), // Add template service later
    Promise.resolve([]), // Add parent pages fetching later
  ]);

  const handleUpdatePage = async (id: string, updates: UpdateDocumentationPageRequest) => {
    'use server';
    try {
      return await documentationServiceServer.updatePage(id, updates);
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  };

  const handleCreatePage = async (data: CreateDocumentationPageRequest) => {
    'use server';
    try {
      return await documentationServiceServer.createPage(data);
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  };

  const handleDeletePage = async (id: string) => {
    'use server';
    try {
      await documentationServiceServer.deletePage(id);
      // Redirect to docs home after deletion
      return { redirect: '/docs' };
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <EnhancedDocumentationPage
            page={page}
            isAdmin={isAdmin}
            initialEditMode={isEditMode}
            onUpdatePage={handleUpdatePage}
            onCreatePage={handleCreatePage}
            onDeletePage={handleDeletePage}
            tags={tags}
            templates={templates}
            parentPages={parentPages}
            categories={[]}
          />
        </Suspense>
      </div>
    </div>
  );
} 