"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WizardStepProps, ToolOption } from './types'
import { cn } from '@/lib/utils'

const TOOL_OPTIONS: ToolOption[] = [
  // Linting
  {
    id: 'eslint',
    name: 'ESLint',
    description: 'JavaScript and TypeScript linting utility',
    category: 'linting',
    requiredFor: ['javascript', 'typescript']
  },
  {
    id: 'pylint',
    name: 'Pylint',
    description: 'Python code analysis tool',
    category: 'linting',
    requiredFor: ['python']
  },
  {
    id: 'swiftlint',
    name: 'SwiftLint',
    description: 'Swift style and conventions enforcement',
    category: 'linting',
    requiredFor: ['swift']
  },
  // Formatting
  {
    id: 'prettier',
    name: 'Prettier',
    description: 'Opinionated code formatter',
    category: 'formatting',
    requiredFor: ['javascript', 'typescript']
  },
  {
    id: 'black',
    name: 'Black',
    description: 'Python code formatter',
    category: 'formatting',
    requiredFor: ['python']
  },
  {
    id: 'swift-format',
    name: 'Swift Format',
    description: 'Swift code formatter',
    category: 'formatting',
    requiredFor: ['swift']
  },
  // Testing
  {
    id: 'jest',
    name: 'Jest',
    description: 'JavaScript testing framework',
    category: 'testing',
    requiredFor: ['javascript', 'typescript', 'react']
  },
  {
    id: 'vitest',
    name: 'Vitest',
    description: 'Fast unit testing framework',
    category: 'testing',
    requiredFor: ['typescript', 'vue']
  },
  {
    id: 'pytest',
    name: 'PyTest',
    description: 'Python testing framework',
    category: 'testing',
    requiredFor: ['python']
  },
  {
    id: 'xctest',
    name: 'XCTest',
    description: 'Swift testing framework',
    category: 'testing',
    requiredFor: ['swift']
  },
  // Bundling
  {
    id: 'webpack',
    name: 'Webpack',
    description: 'Module bundler for JavaScript applications',
    category: 'bundling',
    requiredFor: ['react']
  },
  {
    id: 'vite',
    name: 'Vite',
    description: 'Fast build tool and development server',
    category: 'bundling',
    requiredFor: ['vue', 'react']
  },
  {
    id: 'parcel',
    name: 'Parcel',
    description: 'Zero-configuration build tool',
    category: 'bundling',
    optional: true
  },
  // Deployment
  {
    id: 'docker',
    name: 'Docker',
    description: 'Containerization platform',
    category: 'deployment',
    optional: true
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    description: 'CI/CD workflows',
    category: 'deployment',
    optional: true
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Frontend deployment platform',
    category: 'deployment',
    requiredFor: ['nextjs']
  }
]

export function ToolPreferencesStep({
  data,
  onNext,
  onBack,
  onUpdateData,
  currentStep,
  totalSteps
}: WizardStepProps) {
  const [selectedTools, setSelectedTools] = useState(() => {
    return Object.keys(data.toolPreferences).filter(key => data.toolPreferences[key])
  })

  // Get required and suggested tools based on previous selections
  const selectedLanguages = Object.keys(data.languageChoices).filter(key => data.languageChoices[key])
  const selectedStacks = Object.keys(data.stackChoices).filter(key => data.stackChoices[key])
  const allSelections = [...selectedLanguages, ...selectedStacks]

  const requiredTools = TOOL_OPTIONS.filter(tool => 
    tool.requiredFor?.some(req => allSelections.includes(req))
  )

  const optionalTools = TOOL_OPTIONS.filter(tool => 
    tool.optional || !tool.requiredFor?.length
  )

  const handleToolToggle = (toolId: string) => {
    const newSelection = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId]
    
    setSelectedTools(newSelection)
    
    // Update the data immediately
    const toolPreferences = TOOL_OPTIONS.reduce((acc, tool) => {
      acc[tool.id] = newSelection.includes(tool.id)
      return acc
    }, {} as Record<string, boolean>)
    
    onUpdateData({ toolPreferences })
  }

  const handleNext = () => {
    onNext()
  }

  const groupedTools = TOOL_OPTIONS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, ToolOption[]>)

  const categoryOrder: Array<ToolOption['category']> = ['linting', 'formatting', 'testing', 'bundling', 'deployment', 'other']
  const categoryLabels: Record<ToolOption['category'], string> = {
    linting: 'Code Linting',
    formatting: 'Code Formatting',
    testing: 'Testing Frameworks',
    bundling: 'Build Tools',
    deployment: 'Deployment & CI/CD',
    other: 'Other Tools'
  }

  const ToolCard = ({ tool, isRequired = false, isOptional = false }: { 
    tool: ToolOption
    isRequired?: boolean
    isOptional?: boolean 
  }) => {
    const isSelected = selectedTools.includes(tool.id)
    
    return (
      <Card
        key={tool.id}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          isSelected && "ring-2 ring-success bg-success/10",
          isRequired && "border-success/50 bg-success/5"
        )}
        onClick={() => handleToolToggle(tool.id)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between min-h-[48px]">
            <CardTitle className="text-base flex-1 pr-2">{tool.name}</CardTitle>
            <div className="flex flex-wrap gap-1 items-start justify-end min-w-0 flex-shrink-0">
              {isRequired && (
                <Badge variant="secondary" className="text-xs bg-success/20 text-success dark:text-success/90 whitespace-nowrap">
                  Recommended
                </Badge>
              )}
              {isOptional && (
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  Optional
                </Badge>
              )}
              {isSelected && (
                <Badge variant="default" className="text-xs bg-success text-success-foreground whitespace-nowrap">
                  Selected
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-sm">
            {tool.description}
          </CardDescription>
        </CardHeader>
        {tool.requiredFor && tool.requiredFor.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Works with:</span>
              {tool.requiredFor.map(req => (
                <Badge key={req} variant="outline" className="text-xs whitespace-nowrap">
                  {req}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Development Tools</h2>
        <p className="text-muted-foreground">
          Choose the tools and utilities for your development workflow
        </p>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Recommended Tools Section */}
      {requiredTools.length > 0 && (
        <Card className="bg-success/10 border-success/50 dark:bg-success/10 dark:border-success/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recommended Tools</CardTitle>
            <CardDescription>
              Based on your language and framework selections, these tools are recommended
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requiredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} isRequired />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {categoryOrder.map(category => {
          const tools = groupedTools[category] || []
          if (tools.length === 0) return null

          // Filter out already shown required tools
          const categoryTools = tools.filter(tool => !requiredTools.includes(tool))
          if (categoryTools.length === 0) return null

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold">{categoryLabels[category]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} isOptional={tool.optional} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedTools.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Selected Tools:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTools.map(toolId => {
                const tool = TOOL_OPTIONS.find(t => t.id === toolId)
                return (
                  <Badge key={toolId} variant="default">
                    {tool?.name}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="relative overflow-hidden bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border border-primary/20 dark:border-purple-700/30 hover:bg-primary/10 dark:hover:bg-purple-800/30 transition-all duration-300 hover:border-primary/40 dark:hover:border-purple-600/50 hover:shadow-md group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative">Back</span>
        </Button>
        <Button 
          onClick={handleNext}
          size="lg"
          className="min-w-[120px] relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 backdrop-blur-sm border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
          style={{
            boxShadow: `
              0 8px 16px rgba(139, 92, 246, 0.25),
              0 0 0 1px rgba(139, 92, 246, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.2)
            `
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative drop-shadow-sm">Next: Environment</span>
        </Button>
      </div>
    </div>
  )
} 