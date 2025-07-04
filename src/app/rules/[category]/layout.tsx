import { Metadata } from "next"
import { getCategory } from "@/lib/services/supabase-rule-service"

type CategoryLayoutProps = {
  params: Promise<{
    category: string
  }>
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: CategoryLayoutProps
): Promise<Metadata> {
  const awaitedParams = await params;
  const { category } = awaitedParams;

  try {
    // Get category info from database
    const categoryData = await getCategory(category);

    if (!categoryData) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found."
      }
    }

    return {
      title: categoryData.title || categoryData.name,
      description: categoryData.description
    }
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: "Category Not Found",
      description: "The requested category could not be found."
    }
  }
}

export default async function CategoryLayout({
  children,
  params
}: CategoryLayoutProps) {
  // Await the params for Next.js 15 compatibility
  const awaitedParams = await params;
  
  // Don't validate category existence here - let individual pages handle their own validation
  // This prevents individual rule pages from being affected by category validation issues
  
  return (
    <div className="category-layout">
      {children}
    </div>
  )
}
