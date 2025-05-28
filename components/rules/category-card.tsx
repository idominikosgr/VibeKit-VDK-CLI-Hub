"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { RuleCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  category: RuleCategory
  view?: "cards" | "details"
  className?: string
}

const getIconComponent = (iconName: string, className?: string) => {
  const iconProps = { className: cn("h-5 w-5", className) }
  
  switch (iconName?.toLowerCase()) {
    case "languages":
    case "language":
      return <Icons.languages {...iconProps} />
    case "technologies":
    case "technology":
      return <Icons.technologies {...iconProps} />
    case "frameworks":
    case "framework":
      return <Icons.frameworks {...iconProps} />
    case "tasks":
    case "task":
      return <Icons.tasks {...iconProps} />
    case "stacks":
    case "stack":
      return <Icons.stacks {...iconProps} />
    case "aitools":
    case "ai-tools":
    case "ai":
      return <Icons.aitools {...iconProps} />
    case "tools":
    case "tool":
      return <Icons.tools {...iconProps} />
    case "security":
      return <Icons.security {...iconProps} />
    case "performance":
      return <Icons.performance {...iconProps} />
    case "testing":
      return <Icons.testing {...iconProps} />
    case "documentation":
    case "docs":
      return <Icons.documentation {...iconProps} />
    case "cloud":
      return <Icons.cloud {...iconProps} />
    case "mobile":
      return <Icons.mobile {...iconProps} />
    case "web":
      return <Icons.web {...iconProps} />
    case "database":
    case "databases":
      return <Icons.databases {...iconProps} />
    case "design":
      return <Icons.design {...iconProps} />
    case "backend":
      return <Icons.backend {...iconProps} />
    case "frontend":
      return <Icons.frontend {...iconProps} />
    default:
      return <Icons.code {...iconProps} />
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -4, transition: { duration: 0.2 } }
}

export function CategoryCard({ category, view = "cards", className }: CategoryCardProps) {
  const icon = getIconComponent(category.icon || category.slug || "code")
  
  if (view === "details") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={className}
      >
        <Link href={`/rules/${category.slug}`}>
          <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-300">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {category.title || category.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {category.description}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto flex-shrink-0">
                  {category.count} {category.count === 1 ? 'rule' : 'rules'}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={className}
    >
      <Link href={`/rules/${category.slug}`}>
        <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
              {getIconComponent(category.icon || category.slug || "code", "h-8 w-8 text-primary")}
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              {category.title || category.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center px-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {category.description}
            </p>
          </CardContent>
          <CardFooter className="justify-center pt-2">
            <Badge variant="outline" className="group-hover:border-primary/50 transition-colors duration-300">
              {category.count} {category.count === 1 ? 'rule' : 'rules'}
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
} 