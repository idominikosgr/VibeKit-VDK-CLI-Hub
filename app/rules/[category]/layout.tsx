import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategory } from "@/lib/services/supabase-rule-service"

type CategoryLayoutProps = {
  params: {
    category: string
  }
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
  const awaitedParams = await params;
  const { category } = awaitedParams;

  try {
    // Fetch category from database
    const categoryData = await getCategory(category);

    // Validate category exists
    if (!categoryData) {
      notFound()
    }

    return (
      <div className="category-layout">
        {children}
      </div>
    )
  } catch (error) {
    console.error('Error loading category layout:', error);
    notFound()
  }
}
