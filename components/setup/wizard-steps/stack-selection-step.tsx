"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WizardStepProps, StackOption } from './types'
import { cn } from '@/lib/utils'

const STACK_OPTIONS: StackOption[] = [
  // Frontend Frameworks
  {
    id: 'react',
    name: 'React',
    description: 'Component-based UI library with hooks and modern patterns',
    category: 'frontend',
    languages: ['javascript', 'typescript'],
    popular: true,
  },
  {
    id: 'vue',
    name: 'Vue.js',
    description: 'Progressive JavaScript framework with reactive data binding',
    category: 'frontend',
    languages: ['javascript', 'typescript'],
    popular: true,
  },
  {
    id: 'angular',
    name: 'Angular',
    description: 'Full-featured TypeScript framework with dependency injection',
    category: 'frontend',
    languages: ['typescript'],
    popular: true,
  },
  {
    id: 'svelte',
    name: 'Svelte',
    description: 'Compile-time optimized framework with no virtual DOM',
    category: 'frontend',
    languages: ['javascript', 'typescript'],
  },
  // Full-stack Frameworks
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'React-based full-stack framework with SSR and API routes',
    category: 'fullstack',
    languages: ['javascript', 'typescript'],
    popular: true,
  },
  {
    id: 'nuxtjs',
    name: 'Nuxt.js',
    description: 'Vue-based full-stack framework with server-side rendering',
    category: 'fullstack',
    languages: ['javascript', 'typescript'],
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    description: 'Svelte-based application framework with modern tooling',
    category: 'fullstack',
    languages: ['javascript', 'typescript'],
  },
  // Backend Frameworks
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript runtime for server-side development',
    category: 'backend',
    languages: ['javascript', 'typescript'],
    popular: true,
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    description: 'Modern Python API framework with automatic docs',
    category: 'backend',
    languages: ['python'],
    popular: true,
  },
  {
    id: 'django',
    name: 'Django',
    description: 'High-level Python web framework with batteries included',
    category: 'backend',
    languages: ['python'],
  },
  {
    id: 'flask',
    name: 'Flask',
    description: 'Lightweight Python web framework',
    category: 'backend',
    languages: ['python'],
  },
  // Mobile Frameworks
  {
    id: 'swiftui',
    name: 'SwiftUI',
    description: 'Declarative UI framework for iOS, macOS, and more',
    category: 'mobile',
    languages: ['swift'],
    popular: true,
  },
  {
    id: 'react-native',
    name: 'React Native',
    description: 'Cross-platform mobile development with React',
    category: 'mobile',
    languages: ['javascript', 'typescript'],
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Cross-platform mobile and web development with Dart',
    category: 'mobile',
    languages: ['dart'],
  },
]

export function StackSelectionStep({
  data,
  onNext,
  onBack,
  onUpdateData,
  currentStep,
  totalSteps
}: WizardStepProps) {
  const [selectedStacks, setSelectedStacks] = useState(() => {
    return Object.keys(data.stackChoices).filter(key => data.stackChoices[key])
  })

  const handleStackToggle = (stackId: string) => {
    const newSelection = selectedStacks.includes(stackId)
      ? selectedStacks.filter(id => id !== stackId)
      : [...selectedStacks, stackId]
    
    setSelectedStacks(newSelection)
    
    // Update the data immediately
    const stackChoices = STACK_OPTIONS.reduce((acc, stack) => {
      acc[stack.id] = newSelection.includes(stack.id)
      return acc
    }, {} as Record<string, boolean>)
    
    onUpdateData({ stackChoices })
  }

  const handleNext = () => {
    onNext()
  }

  const groupedStacks = STACK_OPTIONS.reduce((acc, stack) => {
    if (!acc[stack.category]) {
      acc[stack.category] = []
    }
    acc[stack.category].push(stack)
    return acc
  }, {} as Record<string, StackOption[]>)

  const categoryOrder: Array<StackOption['category']> = ['frontend', 'fullstack', 'backend', 'mobile']
  const categoryLabels: Record<StackOption['category'], string> = {
    frontend: 'Frontend Frameworks',
    fullstack: 'Full-Stack Frameworks', 
    backend: 'Backend Frameworks',
    mobile: 'Mobile Frameworks'
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Choose Your Stack</h2>
        <p className="text-muted-foreground">
          Select the frameworks and technologies you&apos;re using in your project
        </p>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="space-y-8">
        {categoryOrder.map(category => {
          const stacks = groupedStacks[category] || []
          if (stacks.length === 0) return null

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold">{categoryLabels[category]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stacks.map(stack => {
                  const isSelected = selectedStacks.includes(stack.id)
                  return (
                    <Card
                      key={stack.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        isSelected && "ring-2 ring-primary bg-primary/5"
                      )}
                      onClick={() => handleStackToggle(stack.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{stack.name}</CardTitle>
                          <div className="flex gap-1">
                            {stack.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {stack.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {stack.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selectedStacks.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Selected Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedStacks.map(stackId => {
                const stack = STACK_OPTIONS.find(s => s.id === stackId)
                return (
                  <Badge key={stackId} variant="default">
                    {stack?.name}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleNext}
          size="lg"
          className="min-w-[120px]"
        >
          Next: Languages
        </Button>
      </div>
    </div>
  )
} 