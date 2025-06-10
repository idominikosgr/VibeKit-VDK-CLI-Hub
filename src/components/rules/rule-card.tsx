"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Rule } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RuleCardProps {
  rule: Rule
  view?: "cards" | "details"
  className?: string
  onOpenModal?: (rule: Rule) => void
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -2, transition: { duration: 0.2 } }
}

export function RuleCard({ rule, view = "cards", className, onOpenModal }: RuleCardProps) {
  const ruleUrl = `/rules/${rule.categorySlug || 'core'}/${rule.id}`
  
  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onOpenModal) {
      onOpenModal(rule)
    }
  }
  
  if (view === "details") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={className}
      >
        <Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  <Link href={ruleUrl} className="hover:underline">
                    {rule.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {rule.description}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Icons.thumbsUp className="h-4 w-4" />
                  <span>{rule.votes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icons.download className="h-4 w-4" />
                  <span>{rule.downloads}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 mb-4">
              {rule.tags?.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {rule.tags && rule.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{rule.tags.length - 4} more
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>v{rule.version}</span>
              <span>•</span>
              <span>{rule.categoryName}</span>
            </div>
            <div className="flex items-center gap-2">
              {onOpenModal && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePreviewClick}
                  className="group-hover:border-primary/50 transition-colors duration-300"
                >
                  Preview
                  <Icons.maximize className="ml-1 h-3 w-3" />
                </Button>
              )}
              <Button variant="outline" size="sm" asChild className="group-hover:border-primary/50 transition-colors duration-300">
                <Link href={ruleUrl}>
                  View Rule
                  <Icons.chevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
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
      <Card className="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex-1 pb-3">
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
            <Link href={ruleUrl} className="hover:underline">
              {rule.title}
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {rule.description}
          </p>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {rule.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {rule.tags && rule.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{rule.tags.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>v{rule.version}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Icons.thumbsUp className="h-3 w-3" />
                <span>{rule.votes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.download className="h-3 w-3" />
                <span>{rule.downloads}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex-col gap-2">
          <Button variant="outline" size="sm" className="w-full group-hover:border-primary/50 transition-colors duration-300" asChild>
            <Link href={ruleUrl}>
              View Rule
              <Icons.chevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
          {onOpenModal && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full group-hover:border-primary/50 transition-colors duration-300"
              onClick={handlePreviewClick}
            >
              Preview Rule
              <Icons.maximize className="ml-1 h-3 w-3" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
} 