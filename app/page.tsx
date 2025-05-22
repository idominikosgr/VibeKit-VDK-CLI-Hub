import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'

export default function Home() {
  return (
    <div className="space-y-16 pb-16 pt-10">
      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Enhance Your AI-Assisted Development
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-muted-foreground">
            CodePilotRules Hub provides comprehensive guidelines for AI coding assistants across
            multiple platforms, languages, and technologies.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/rules">
            <Button size="lg">Browse Rules</Button>
          </Link>
          <Link href="/setup">
            <Button variant="outline" size="lg">Setup Wizard</Button>
          </Link>
        </div>
      </section>

      {/* Key Features */}
      <section className="container">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Comprehensive guidelines for modern AI-assisted development workflows.
          </p>
        </div>
        <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 pt-8">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="rounded-md bg-primary/10 p-2 w-10 h-10 flex items-center justify-center mb-2">
                <Icons.logo className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Multi-Platform Support</CardTitle>
              <CardDescription>
                Support for different AI assistants and IDEs with specialized rule sets.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <div className="rounded-md bg-primary/10 p-2 w-10 h-10 flex items-center justify-center mb-2">
                <Icons.code className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Language-Specific Rules</CardTitle>
              <CardDescription>
                Enhanced guidelines for various programming languages and frameworks.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <div className="rounded-md bg-primary/10 p-2 w-10 h-10 flex items-center justify-center mb-2">
                <Icons.brain className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Memory Management</CardTitle>
              <CardDescription>
                Session handoff protocols and memory management for better continuity.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <div className="rounded-md bg-primary/10 p-2 w-10 h-10 flex items-center justify-center mb-2">
                <Icons.settings className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Setup Wizard</CardTitle>
              <CardDescription>
                Interactive setup for project-specific configuration and rule selection.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <div className="rounded-md bg-primary/10 p-2 w-10 h-10 flex items-center justify-center mb-2">
                <Icons.tasks className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Task-Specific Guides</CardTitle>
              <CardDescription>
                51 specialized task rules for different development scenarios.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <div className="rounded-md bg-primary/10 p-2 w-10 h-10 flex items-center justify-center mb-2">
                <Icons.git className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>
                Rule files with compatibility indicators and version tracking.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Browse by Category</h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Explore our comprehensive collection of rules and guidelines.
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 pt-8">
          <Link href="/rules/languages">
            <Card className="flex h-full flex-col items-center justify-center py-8 transition-colors hover:bg-muted/50">
              <CardHeader className="text-center">
                <CardTitle>Languages</CardTitle>
                <CardDescription>TypeScript, Swift, Python, and more</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/rules/technologies">
            <Card className="flex h-full flex-col items-center justify-center py-8 transition-colors hover:bg-muted/50">
              <CardHeader className="text-center">
                <CardTitle>Technologies</CardTitle>
                <CardDescription>React, SwiftUI, FastAPI, GraphQL</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/rules/tasks">
            <Card className="flex h-full flex-col items-center justify-center py-8 transition-colors hover:bg-muted/50">
              <CardHeader className="text-center">
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Code review, refactoring, documentation</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/rules/aitools">
            <Card className="flex h-full flex-col items-center justify-center py-8 transition-colors hover:bg-muted/50">
              <CardHeader className="text-center">
                <CardTitle>AI Tools</CardTitle>
                <CardDescription>Sequential thinking, memory management</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container bg-primary/5 py-16 rounded-3xl">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Ready to enhance your AI-assisted development?
          </h2>
          <p className="max-w-[85%] text-muted-foreground dark:text-muted-foreground">
            Get started with CodePilotRules today and experience more efficient,
            consistent, and high-quality AI assistance.
          </p>
          <Link href="/setup">
            <Button size="lg" className="mt-4">Start Setup Wizard</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
