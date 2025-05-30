"use client"

import React, { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { fetchRuleCategories, fetchSearchRules, fetchAllRules, fetchSingleRule } from "@/lib/services/client-rule-service"
import { SearchBar } from "@/components/search/search-bar"
import { CategoryGridSkeleton } from '@/components/ui/loading'
import { RuleCategory, Rule } from '@/lib/types'
import { AlertCircle } from 'lucide-react'
import { CategoryCard } from "@/components/rules/category-card"
import { RuleCard } from "@/components/rules/rule-card"
import { ViewToggle } from "@/components/ui/view-toggle"
import { RuleModal } from "@/components/rules/rule-modal"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function RulesCatalogClient() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ""
  const tab = searchParams.get('tab') || "categories"
  
  const [categoriesView, setCategoriesView] = useState<"cards" | "details">("cards")
  const [rulesView, setRulesView] = useState<"cards" | "details">("details")
  const [categories, setCategories] = useState<RuleCategory[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  // Modal state
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load categories
        const categoriesData = await fetchRuleCategories()
        setCategories(categoriesData)
        console.log(`Loaded ${categoriesData.length} categories from API`)

        // If we're on the rules tab, fetch rules
        if (tab === "rules") {
          if (searchQuery) {
            const rulesResult = await fetchSearchRules(searchQuery, 1, 50)
            setRules(rulesResult.data)
            console.log(`Loaded ${rulesResult.data.length} rules from search: "${searchQuery}"`)
          } else {
            const rulesResult = await fetchAllRules(1, 50)
            setRules(rulesResult.data)
            console.log(`Loaded ${rulesResult.data.length} rules from API (all rules)`)
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchQuery, tab])

  // Handle modal open for rule preview
  const handleOpenRuleModal = async (rule: Rule) => {
    try {
      setModalLoading(true)
      setModalOpen(true)
      
      // Fetch the full rule data
      const fullRule = await fetchSingleRule(rule.id, rule.categorySlug)
      setSelectedRule(fullRule)
    } catch (err) {
      console.error('Failed to load rule for modal:', err)
      setError('Failed to load rule details')
      setModalOpen(false)
    } finally {
      setModalLoading(false)
    }
  }

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedRule(null)
  }

  return (
    <div className="container py-10">
      <motion.div 
        className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-bold tracking-tight lg:text-5xl bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Rules Catalog
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse our comprehensive collection of AI-assisted development rules and guidelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/setup">
            <Button className="hover:scale-105 transition-transform duration-200">
              <Icons.settings className="mr-2 h-4 w-4" />
              Setup Wizard
            </Button>
          </Link>
        </div>
      </motion.div>

      <Tabs defaultValue={tab} className="mt-8">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <TabsList className="bg-background border">
            <TabsTrigger value="categories" asChild>
              <Link href="/rules?tab=categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icons.folder className="mr-2 h-4 w-4" />
                Categories
              </Link>
            </TabsTrigger>
            <TabsTrigger value="rules" asChild>
              <Link href="/rules?tab=rules" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icons.code className="mr-2 h-4 w-4" />
                All Rules
              </Link>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-4">
            <div className="w-full max-w-sm">
              <SearchBar
                placeholder={tab === "rules" ? "Search rules..." : "Search categories..."}
              />
            </div>
            <ViewToggle
              view={tab === "categories" ? categoriesView : rulesView}
              onViewChange={(view) => {
                if (tab === "categories") {
                  setCategoriesView(view)
                } else {
                  setRulesView(view)
                }
              }}
            />
          </div>
        </motion.div>

        {error ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 text-center"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-2xl font-bold mb-2">Failed to load data</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" asChild>
              <Link href="/rules">Try Again</Link>
            </Button>
          </motion.div>
        ) : (
          <>
            <TabsContent value="categories">
              {loading ? (
                <CategoryGridSkeleton count={8} />
              ) : categories.length > 0 ? (
                <motion.div 
                  className={
                    categoriesView === "cards" 
                      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
                  }
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CategoryCard 
                        category={category} 
                        view={categoriesView}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16 text-center"
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <Icons.folder className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No categories found</h3>
                  <p className="text-muted-foreground mb-6">
                    No rule categories are available at this time.
                  </p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="rules">
              {loading ? (
                <CategoryGridSkeleton count={6} />
              ) : rules.length > 0 ? (
                <motion.div 
                  className={
                    rulesView === "cards"
                      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {rules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                    >
                      <RuleCard 
                        rule={rule} 
                        view={rulesView}
                        onOpenModal={handleOpenRuleModal}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16 text-center"
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-bold mb-2">No rules found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `No rules match "${searchQuery}".`
                      : "No rules are available at this time."
                    }
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/setup">
                      <Icons.settings className="mr-2 h-4 w-4" />
                      Setup Wizard
                    </Link>
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      {selectedRule && (
        <RuleModal
          rule={selectedRule}
          open={modalOpen}
          onOpenChange={handleCloseModal}
        />
      )}
    </div>
  )
} 