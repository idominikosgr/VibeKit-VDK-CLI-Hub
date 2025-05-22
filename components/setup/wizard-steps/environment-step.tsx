"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { WizardStepProps } from './types'

export function EnvironmentStep({
  data,
  onNext,
  onBack,
  onUpdateData,
  currentStep,
  totalSteps
}: WizardStepProps) {
  const [environment, setEnvironment] = useState(() => ({
    nodeVersion: String(data.environmentDetails.nodeVersion || ''),
    packageManager: String(data.environmentDetails.packageManager || 'npm'),
    outputFormat: String(data.environmentDetails.outputFormat || 'zip'),
    targetEnvironment: String(data.environmentDetails.targetEnvironment || 'development'),
    includeDevDependencies: data.environmentDetails.includeDevDependencies !== false,
    includeDocumentation: data.environmentDetails.includeDocumentation !== false,
    pythonVersion: String(data.environmentDetails.pythonVersion || ''),
    pythonManager: String(data.environmentDetails.pythonManager || 'pip'),
    swiftVersion: String(data.environmentDetails.swiftVersion || ''),
    xcodeVersion: String(data.environmentDetails.xcodeVersion || ''),
    ...data.environmentDetails
  }))

  const updateEnvironment = (key: string, value: any) => {
    const newEnvironment = { ...environment, [key]: value }
    setEnvironment(newEnvironment)
    onUpdateData({ environmentDetails: newEnvironment })
  }

  const handleNext = () => {
    onNext()
  }

  // Check if we have web technologies to show Node.js options
  const hasWebTech = Object.keys(data.stackChoices).some(key => 
    data.stackChoices[key] && ['react', 'vue', 'angular', 'nextjs', 'nodejs'].includes(key)
  )

  const hasSwiftTech = Object.keys(data.stackChoices).some(key =>
    data.stackChoices[key] && ['swiftui'].includes(key)
  )

  const hasPythonTech = Object.keys(data.languageChoices).some(key =>
    data.languageChoices[key] && ['python'].includes(key)
  )

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Environment Setup</h2>
        <p className="text-muted-foreground">
          Configure environment-specific settings for your project
        </p>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="space-y-6">
        {/* Package Output Format */}
        <Card>
          <CardHeader>
            <CardTitle>Output Format</CardTitle>
            <CardDescription>
              Choose how you'd like to receive your customized rules package
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={environment.outputFormat}
              onValueChange={(value) => updateEnvironment('outputFormat', value)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="zip" id="zip" />
                <div>
                  <Label htmlFor="zip" className="cursor-pointer font-medium">
                    ZIP Archive
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Download ready-to-use files
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="bash" id="bash" />
                <div>
                  <Label htmlFor="bash" className="cursor-pointer font-medium">
                    Bash Script
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Executable setup script
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="config" id="config" />
                <div>
                  <Label htmlFor="config" className="cursor-pointer font-medium">
                    Config Files
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Individual configuration files
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Node.js Environment */}
        {hasWebTech && (
          <Card>
            <CardHeader>
              <CardTitle>Node.js Environment</CardTitle>
              <CardDescription>
                Configure Node.js and package manager settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="node-version">Node.js Version</Label>
                  <Select
                    value={environment.nodeVersion}
                    onValueChange={(value) => updateEnvironment('nodeVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Node.js version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">Node.js 20 (Current LTS)</SelectItem>
                      <SelectItem value="18">Node.js 18 (LTS)</SelectItem>
                      <SelectItem value="16">Node.js 16 (Legacy)</SelectItem>
                      <SelectItem value="latest">Latest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package-manager">Package Manager</Label>
                  <Select
                    value={environment.packageManager}
                    onValueChange={(value) => updateEnvironment('packageManager', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="npm">npm</SelectItem>
                      <SelectItem value="yarn">Yarn</SelectItem>
                      <SelectItem value="pnpm">pnpm</SelectItem>
                      <SelectItem value="bun">Bun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Python Environment */}
        {hasPythonTech && (
          <Card>
            <CardHeader>
              <CardTitle>Python Environment</CardTitle>
              <CardDescription>
                Configure Python version and package management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="python-version">Python Version</Label>
                  <Select
                    value={environment.pythonVersion || ''}
                    onValueChange={(value) => updateEnvironment('pythonVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Python version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3.12">Python 3.12</SelectItem>
                      <SelectItem value="3.11">Python 3.11</SelectItem>
                      <SelectItem value="3.10">Python 3.10</SelectItem>
                      <SelectItem value="3.9">Python 3.9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="python-manager">Package Manager</Label>
                  <Select
                    value={environment.pythonManager || 'pip'}
                    onValueChange={(value) => updateEnvironment('pythonManager', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pip">pip</SelectItem>
                      <SelectItem value="poetry">Poetry</SelectItem>
                      <SelectItem value="pipenv">Pipenv</SelectItem>
                      <SelectItem value="conda">Conda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Swift Environment */}
        {hasSwiftTech && (
          <Card>
            <CardHeader>
              <CardTitle>Swift Environment</CardTitle>
              <CardDescription>
                Configure Swift and Xcode settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="swift-version">Swift Version</Label>
                  <Select
                    value={environment.swiftVersion || ''}
                    onValueChange={(value) => updateEnvironment('swiftVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Swift version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5.9">Swift 5.9</SelectItem>
                      <SelectItem value="5.8">Swift 5.8</SelectItem>
                      <SelectItem value="5.7">Swift 5.7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xcode-version">Xcode Version</Label>
                  <Select
                    value={environment.xcodeVersion || ''}
                    onValueChange={(value) => updateEnvironment('xcodeVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Xcode version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">Xcode 15</SelectItem>
                      <SelectItem value="14">Xcode 14</SelectItem>
                      <SelectItem value="13">Xcode 13</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Target Environment */}
        <Card>
          <CardHeader>
            <CardTitle>Target Environment</CardTitle>
            <CardDescription>
              Specify the deployment environment for optimized rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={environment.targetEnvironment}
              onValueChange={(value) => updateEnvironment('targetEnvironment', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="development" id="development" />
                <div>
                  <Label htmlFor="development" className="cursor-pointer font-medium">
                    Development
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Local development with debugging
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="production" id="production" />
                <div>
                  <Label htmlFor="production" className="cursor-pointer font-medium">
                    Production
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Optimized for deployment
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
            <CardDescription>
              Customize what's included in your rules package
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dev-dependencies"
                checked={environment.includeDevDependencies}
                onChange={(e) => updateEnvironment('includeDevDependencies', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="dev-dependencies">
                Include development dependencies and tools
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="documentation"
                checked={environment.includeDocumentation}
                onChange={(e) => updateEnvironment('includeDocumentation', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="documentation">
                Include documentation and setup guides
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleNext}
          size="lg"
          className="min-w-[120px]"
        >
          Preview Package
        </Button>
      </div>
    </div>
  )
} 