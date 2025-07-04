"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardHover = {
  hover: { y: -4, transition: { duration: 0.2 } },
};

export default function House() {
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
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Make your AI assistant project-aware
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-muted-foreground">
            The comprehensive toolkit for AI-assisted development. Browse
            curated expert rules on our web platform or deploy the VibeKit VDK
            CLI toolkit for automated, project-aware AI intelligence.
          </p>
        </div>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          variants={fadeInUp}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link href="/rules">
            <Button
              size="lg"
              className="hover:scale-105 transition-transform duration-200"
            >
              <Icons.code className="mr-2 h-4 w-4" />
              Browse Rules
            </Button>
          </Link>
          <Link href="/generate">
            <Button
              variant="outline"
              size="lg"
              className="hover:scale-105 transition-transform duration-200"
            >
              <Icons.settings className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Key Features */}
      <section className="container">
        <motion.div
          className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Key Features
          </h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Comprehensive guidelines for modern AI-assisted development
            workflows.
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
                  className="rounded-md bg-linear-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.aitools className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Multi-Platform Support
                </CardTitle>
                <CardDescription>
                  Support for different AI assistants and IDEs with specialized
                  rule sets.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div
                  className="rounded-md bg-linear-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.languages className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Language-Specific Rules
                </CardTitle>
                <CardDescription>
                  Enhanced guidelines for various programming languages and
                  frameworks.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div
                  className="rounded-md bg-linear-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.brain className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Memory Management
                </CardTitle>
                <CardDescription>
                  Session handoff protocols and memory management for better
                  continuity.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div
                  className="rounded-md bg-linear-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.settings className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Rule Generator
                </CardTitle>
                <CardDescription>
                  Interactive setup for project-specific configuration and rule
                  selection.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div
                  className="rounded-md bg-linear-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.tasks className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Task-Specific Guides
                </CardTitle>
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
                  className="rounded-md bg-linear-to-br from-primary/10 to-primary/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.git className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Version Control
                </CardTitle>
                <CardDescription>
                  Rule files with compatibility indicators and version tracking.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div
                  className="rounded-md bg-linear-to-br from-emerald-500/10 to-emerald-500/5 p-2 w-10 h-10 flex items-center justify-center mb-2 group-hover:from-emerald-500/20 group-hover:to-emerald-500/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.settings className="h-5 w-5 text-emerald-600" />
                </motion.div>
                <CardTitle className="group-hover:text-emerald-600 transition-colors duration-300">
                  AI Context Toolkit
                </CardTitle>
                <CardDescription>
                  Deploy intelligent, project-aware rules with the VibeKit VDK
                  CLI toolkit.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Ecosystem Section */}
      <section className="container">
        <motion.div
          className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Choose Your Intelligence Path
          </h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Browse and customize on the web, or deploy automated intelligence
            with our CLI toolkit.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Web Platform Card */}
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div
                  className="rounded-md bg-linear-to-br from-primary/10 to-primary/5 p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.web className="h-6 w-6 text-primary" />
                </motion.div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  CodePilot Rules Hub
                </CardTitle>
                <CardDescription className="text-base">
                  Discover, customize, and download rules through our
                  intelligent web platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-primary" />
                    Browse 108+ expert-curated rules
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-primary" />
                    Interactive Rule Generator
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-primary" />
                    Custom rule packages
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/generate" className="w-full">
                  <Button className="w-full hover:scale-105 transition-transform duration-200">
                    Generate Rules
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* CLI Toolkit Card */}
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 border-border/50 hover:border-emerald-500/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <motion.div
                  className="rounded-md bg-linear-to-br from-emerald-500/10 to-emerald-500/5 p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:from-emerald-500/20 group-hover:to-emerald-500/10 transition-all duration-300"
                  variants={cardHover}
                >
                  <Icons.terminal className="h-6 w-6 text-emerald-600" />
                </motion.div>
                <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors duration-300">
                  VibeKit VDK Toolkit
                </CardTitle>
                <CardDescription className="text-base">
                  Deploy intelligent, project-aware AI rules with one command.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-emerald-600" />
                    Automated project analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-emerald-600" />
                    Context-aware rule generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-emerald-600" />
                    Multi-IDE deployment
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/toolkit" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full hover:scale-105 transition-transform duration-200 border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/10"
                  >
                    Learn About Toolkit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Getting Started */}
      <section className="container">
        <motion.div
          className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Getting Started
          </h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Ready to transform your AI-assisted development workflow?
          </p>
        </motion.div>
        <motion.div
          className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8 max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <motion.div
                  className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300"
                  variants={cardHover}
                >
                  <span className="text-2xl font-bold text-primary">1</span>
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Explore Rules
                </CardTitle>
                <CardDescription>
                  The VibeKit VDK CLI Toolkit automatically analyzes your
                  codebase and generates context-aware rules for intelligent AI
                  assistance.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <motion.div
                  className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300"
                  variants={cardHover}
                >
                  <span className="text-2xl font-bold text-primary">2</span>
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Setup Your Workspace
                </CardTitle>
                <CardDescription>
                  Use our Rule Generator to configure rules for your specific
                  your entire tech stack, frameworks, and development
                  preferences.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover" className="group">
            <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <motion.div
                  className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300"
                  variants={cardHover}
                >
                  <span className="text-2xl font-bold text-primary">3</span>
                </motion.div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">
                  Start Coding Smarter
                </CardTitle>
                <CardDescription>
                  Download your personalized rule package and integrate with any
                  AI coding assistant for context-aware development.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container">
        <motion.div
          className="mx-auto flex max-w-232 flex-col items-center space-y-4 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Browse by Category
          </h2>
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
                    className="mx-auto mb-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.languages className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    Languages
                  </CardTitle>
                  <CardDescription>
                    TypeScript, Swift, Python, and more
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover">
            <Link href="/rules/technologies">
              <Card className="group flex h-full flex-col items-center justify-center py-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.technologies className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    Technologies
                  </CardTitle>
                  <CardDescription>
                    React, SwiftUI, FastAPI, GraphQL
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover">
            <Link href="/rules/tasks">
              <Card className="group flex h-full flex-col items-center justify-center py-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.tasks className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    Tasks
                  </CardTitle>
                  <CardDescription>
                    Code review, refactoring, documentation
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} whileHover="hover">
            <Link href="/rules/aitools">
              <Card className="group flex h-full flex-col items-center justify-center py-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300"
                    variants={cardHover}
                  >
                    <Icons.aitools className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    AI Tools
                  </CardTitle>
                  <CardDescription>
                    Sequential thinking, memory management
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section
        className="container bg-linear-to-br from-primary/5 to-primary/10 py-16 rounded-3xl border border-primary/20"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex max-w-232 flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Ready to make your AI assistant project-aware?
          </h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Transform your AI assistant into a project-aware coding genius.
            Experience systematic intelligence with our curated rules platform
            or deploy the automated VibeKit VDK CLI Toolkit.
          </p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/generate">
              <Button size="lg" className="mt-4">
                <Icons.settings className="mr-2 h-4 w-4" />
                Generate Rules
              </Button>
            </Link>
            <Link href="/hub">
              <Button variant="outline" size="lg" className="mt-4">
                <Icons.brain className="mr-2 h-4 w-4" />
                Explore the VDK Toolkit
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
