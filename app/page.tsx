"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardHover = {
  hover: { y: -4, transition: { duration: 0.2 } }
}

export default function Home() {
  return (
    <div className="space-y-16 pb-16 pt-10">
      {/* Hero Section */}
      <motion.section 
        className="container flex flex-col items-center gap-8 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Enhance Your AI-Assisted Development
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-muted-foreground">
            CodePilotRules Hub provides comprehensive guidelines for AI coding assistants across
            multiple platforms, languages, and technologies.
          </p>
        </div>
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4"
          variants={fadeInUp}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link href="/rules">
            <Button size="lg" className="hover:scale-105 transition-transform duration-200">
              <Icons.code className="mr-2 h-4 w-4" />
              Browse Rules
            </Button>
          </Link>
          <Link href="/setup">
            <Button variant="outline" size="lg" className="hover:scale-105 transition-transform duration-200">
              <Icons.settings className="mr-2 h-4 w-4" />
              Setup Wizard
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Key Features */}
      <section className="container">
        <motion.div 
          className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Comprehensive guidelines for modern AI-assisted development workflows.
          </p>
        </motion.div>
        <motion.div 
          className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div 
                  className="rounded-md bg-gradient-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.aitools className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Multi-Platform Support</CardTitle>
                <CardDescription>
                  Support for different AI assistants and IDEs with specialized rule sets.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div 
                  className="rounded-md bg-gradient-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.languages className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Language-Specific Rules</CardTitle>
                <CardDescription>
                  Enhanced guidelines for various programming languages and frameworks.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div 
                  className="rounded-md bg-gradient-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.brain className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Memory Management</CardTitle>
                <CardDescription>
                  Session handoff protocols and memory management for better continuity.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div 
                  className="rounded-md bg-gradient-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.settings className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Setup Wizard</CardTitle>
                <CardDescription>
                  Interactive setup for project-specific configuration and rule selection.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div 
                  className="rounded-md bg-gradient-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.tasks className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Task-Specific Guides</CardTitle>
                <CardDescription>
                  51 specialized task rules for different development scenarios.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div 
                  className="rounded-md bg-gradient-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.git className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Version Control</CardTitle>
                <CardDescription>
                  Rule files with compatibility indicators and version tracking.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container">
        <motion.div 
          className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Browse by Category</h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Explore our comprehensive collection of rules and guidelines.
          </p>
        </motion.div>
        <motion.div 
          className="mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 pt-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} whileHover="hover">
            <Link href="/rules/languages">
              <Card className="group flex h-full flex-col items-center justify-center py-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div 
                    className="mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.languages className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">Languages</CardTitle>
                  <CardDescription>TypeScript, Swift, Python, and more</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover">
            <Link href="/rules/technologies">
              <Card className="group flex h-full flex-col items-center justify-center py-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div 
                    className="mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.technologies className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">Technologies</CardTitle>
                  <CardDescription>React, SwiftUI, FastAPI, GraphQL</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover">
            <Link href="/rules/tasks">
              <Card className="group flex h-full flex-col items-center justify-center py-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div 
                    className="mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.tasks className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">Tasks</CardTitle>
                  <CardDescription>Code review, refactoring, documentation</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div variants={fadeInUp} whileHover="hover">
            <Link href="/rules/aitools">
              <Card className="group flex h-full flex-col items-center justify-center py-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div 
                    className="mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.aitools className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">AI Tools</CardTitle>
                  <CardDescription>Sequential thinking, memory management</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section 
        className="container bg-gradient-to-br from-primary/5 to-primary/10 py-16 rounded-3xl border border-primary/20"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Ready to enhance your AI-assisted development?
          </h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Get started with CodePilotRules today and experience more efficient,
            consistent, and high-quality AI assistance.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/setup">
              <Button size="lg" className="mt-4">
                <Icons.settings className="mr-2 h-4 w-4" />
                Start Setup Wizard
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
