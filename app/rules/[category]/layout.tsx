import { Metadata } from "next"
import { notFound } from "next/navigation"

// Categories metadata for generateMetadata function
const categoryMetadata = {
  languages: {
    title: "Programming Languages",
    description: "Language-specific rules and best practices for various programming languages",
    icon: "code"
  },
  tasks: {
    title: "Development Tasks",
    description: "Task-specific rules for different development activities and scenarios",
    icon: "tasks"
  },
  technologies: {
    title: "Technologies & Frameworks",
    description: "Framework and tool-specific guidelines for various technologies",
    icon: "settings"
  },
  aitools: {
    title: "AI Tools",
    description: "Guides for AI-enhanced development and workflows",
    icon: "brain"
  }
}

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

  // Get info from our static metadata
  const categoryInfo = categoryMetadata[category as keyof typeof categoryMetadata]

  if (!categoryInfo) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found."
    }
  }

  return {
    title: categoryInfo.title,
    description: categoryInfo.description
  }
}

export default async function CategoryLayout({
  children,
  params
}: CategoryLayoutProps) {
  const awaitedParams = await params;
  const { category } = awaitedParams;
  const categoryInfo = categoryMetadata[category as keyof typeof categoryMetadata]

  // Validate category exists
  if (!categoryInfo) {
    notFound()
  }

  return (
    <div className="category-layout">
      {children}
    </div>
  )
}
