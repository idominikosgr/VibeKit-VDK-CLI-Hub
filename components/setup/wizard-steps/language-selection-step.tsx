"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WizardStepProps, LanguageOption } from './types'
import { cn } from '@/lib/utils'

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Strongly typed JavaScript with modern features',
    category: 'web',
    extensions: ['.ts', '.tsx'],
    popular: true,
    frameworks: ['react', 'angular', 'vue', 'nextjs']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Dynamic programming language for web and server',
    category: 'web',
    extensions: ['.js', '.jsx'],
    popular: true,
    frameworks: ['react', 'vue', 'nodejs']
  },
  {
    id: 'python',
    name: 'Python',
    description: 'High-level language for web, data science, and automation',
    category: 'web',
    extensions: ['.py'],
    popular: true,
    frameworks: ['django', 'flask', 'fastapi']
  },
  {
    id: 'swift',
    name: 'Swift',
    description: 'Modern language for iOS, macOS, and server development',
    category: 'mobile',
    extensions: ['.swift'],
    popular: true,
    frameworks: ['swiftui']
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Object-oriented language for enterprise and Android',
    category: 'systems',
    extensions: ['.java'],
    frameworks: []
  },
  {
    id: 'csharp',
    name: 'C#',
    description: 'Versatile language for .NET development',
    category: 'systems',
    extensions: ['.cs'],
    frameworks: []
  },
  {
    id: 'go',
    name: 'Go',
    description: 'Fast, simple language for system programming',
    category: 'systems',
    extensions: ['.go'],
    frameworks: []
  },
  {
    id: 'rust',
    name: 'Rust',
    description: 'Memory-safe systems programming language',
    category: 'systems',
    extensions: ['.rs'],
    frameworks: []
  },
  {
    id: 'dart',
    name: 'Dart',
    description: 'Language optimized for building UIs',
    category: 'mobile',
    extensions: ['.dart'],
    frameworks: ['flutter']
  },
  {
    id: 'php',
    name: 'PHP',
    description: 'Server-side scripting language for web development',
    category: 'web',
    extensions: ['.php'],
    frameworks: []
  }
]

export function LanguageSelectionStep({
  data,
  onNext,
  onBack,
  onUpdateData,
  currentStep,
  totalSteps
}: WizardStepProps) {
  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    return Object.keys(data.languageChoices).filter(key => data.languageChoices[key])
  })

  // Get suggested languages based on selected stacks
  const selectedStacks = Object.keys(data.stackChoices).filter(key => data.stackChoices[key])
  const suggestedLanguages = LANGUAGE_OPTIONS.filter(lang => 
    selectedStacks.some(stack => lang.frameworks?.includes(stack))
  )

  const handleLanguageToggle = (languageId: string) => {
    const newSelection = selectedLanguages.includes(languageId)
      ? selectedLanguages.filter(id => id !== languageId)
      : [...selectedLanguages, languageId]
    
    setSelectedLanguages(newSelection)
    
    // Update the data immediately
    const languageChoices = LANGUAGE_OPTIONS.reduce((acc, language) => {
      acc[language.id] = newSelection.includes(language.id)
      return acc
    }, {} as Record<string, boolean>)
    
    onUpdateData({ languageChoices })
  }

  const handleNext = () => {
    onNext()
  }

  const groupedLanguages = LANGUAGE_OPTIONS.reduce((acc, language) => {
    if (!acc[language.category]) {
      acc[language.category] = []
    }
    acc[language.category].push(language)
    return acc
  }, {} as Record<string, LanguageOption[]>)

  const categoryOrder: Array<LanguageOption['category']> = ['web', 'mobile', 'systems', 'data', 'other']
  const categoryLabels: Record<LanguageOption['category'], string> = {
    web: 'Web Development',
    mobile: 'Mobile Development',
    systems: 'Systems Programming',
    data: 'Data Science',
    other: 'Other Languages'
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Programming Languages</h2>
        <p className="text-muted-foreground">
          Select the programming languages you'll be using in your project
        </p>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Suggested Languages Section */}
      {suggestedLanguages.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Suggested for Your Stack</CardTitle>
            <CardDescription>
              Based on your selected frameworks, these languages are recommended
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedLanguages.map(language => {
                const isSelected = selectedLanguages.includes(language.id)
                return (
                  <Card
                    key={language.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-sm",
                      isSelected && "ring-2 ring-primary bg-primary/10"
                    )}
                    onClick={() => handleLanguageToggle(language.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{language.name}</h4>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            Suggested
                          </Badge>
                          {isSelected && (
                            <Badge variant="default" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {categoryOrder.map(category => {
          const languages = groupedLanguages[category] || []
          if (languages.length === 0) return null

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold">{categoryLabels[category]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map(language => {
                  const isSelected = selectedLanguages.includes(language.id)
                  const isSuggested = suggestedLanguages.some(l => l.id === language.id)
                  
                  return (
                    <Card
                      key={language.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        isSelected && "ring-2 ring-primary bg-primary/5"
                      )}
                      onClick={() => handleLanguageToggle(language.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{language.name}</CardTitle>
                          <div className="flex gap-1">
                            {language.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                            {isSuggested && (
                              <Badge variant="outline" className="text-xs">
                                Suggested
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
                          {language.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {language.extensions.map(ext => (
                            <Badge key={ext} variant="outline" className="text-xs">
                              {ext}
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

      {selectedLanguages.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Selected Languages:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedLanguages.map(languageId => {
                const language = LANGUAGE_OPTIONS.find(l => l.id === languageId)
                return (
                  <Badge key={languageId} variant="default">
                    {language?.name}
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
          Next: Tools
        </Button>
      </div>
    </div>
  )
} 