"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { WizardStepProps } from './types'
import { Download, Package, FileText, Terminal } from 'lucide-react'
import { generateRulePackage } from '@/lib/actions/rule-actions'
import { toast } from 'sonner'

export function PreviewStep({
  data,
  onBack,
  currentStep,
  totalSteps,
  isLastStep = true
}: WizardStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPackage, setGeneratedPackage] = useState<any>(null)

  const selectedStacks = Object.keys(data.stackChoices).filter(key => data.stackChoices[key])
  const selectedLanguages = Object.keys(data.languageChoices).filter(key => data.languageChoices[key])
  const selectedTools = Object.keys(data.toolPreferences).filter(key => data.toolPreferences[key])

  const handleGeneratePackage = async () => {
    setIsGenerating(true)
    
    try {
      // Create wizard configuration for the rule generator
      const wizardConfig = {
        stackChoices: data.stackChoices,
        languageChoices: data.languageChoices,
        toolPreferences: data.toolPreferences,
        environmentDetails: data.environmentDetails,
        outputFormat: data.environmentDetails.outputFormat || 'zip',
        customRequirements: `Project: ${data.projectInfo.name}${data.projectInfo.description ? ` - ${data.projectInfo.description}` : ''}`
      }

      // Call the setup generation API
      const response = await fetch('/api/setup/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wizardConfig)
      })

      const result = await response.json()
      
      if (!response.ok || result.error) {
        toast.error(result.error || 'Failed to generate package')
        return
      }

      setGeneratedPackage(result.package)
      toast.success('Rule package generated successfully!')
      
    } catch (error) {
      console.error('Error generating package:', error)
      toast.error('Failed to generate rule package')
    } finally {
      setIsGenerating(false)
    }
  }

  const getOutputFormatIcon = () => {
    switch (data.environmentDetails.outputFormat) {
      case 'bash':
        return <Terminal className="h-5 w-5" />
      case 'config':
        return <FileText className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getOutputFormatDescription = () => {
    switch (data.environmentDetails.outputFormat) {
      case 'bash':
        return 'Executable bash script for automated setup'
      case 'config':
        return 'Individual configuration files'
      default:
        return 'ZIP archive with all files and documentation'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Review & Generate</h2>
        <p className="text-muted-foreground">
          Review your selections and generate your customized rules package
        </p>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration Summary</h3>

          {/* Project Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2">{data.projectInfo.name}</span>
              </div>
              {data.projectInfo.description && (
                <div>
                  <span className="font-medium">Description:</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {data.projectInfo.description}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedStacks.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Frameworks:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStacks.map(stack => (
                      <Badge key={stack} variant="secondary" className="text-xs">
                        {stack}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedLanguages.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Languages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedLanguages.map(lang => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedTools.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Tools:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTools.map(tool => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environment Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Environment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Output Format:</span>
                <span className="flex items-center gap-1">
                  {getOutputFormatIcon()}
                  {String(data.environmentDetails.outputFormat || 'zip').toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Target Environment:</span>
                <span className="capitalize">
                  {data.environmentDetails.targetEnvironment || 'development'}
                </span>
              </div>
              {data.environmentDetails.nodeVersion && (
                <div className="flex justify-between">
                  <span className="font-medium">Node.js Version:</span>
                  <span>{data.environmentDetails.nodeVersion}</span>
                </div>
              )}
              {data.environmentDetails.packageManager && (
                <div className="flex justify-between">
                  <span className="font-medium">Package Manager:</span>
                  <span>{data.environmentDetails.packageManager}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Package Generation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generate Package</h3>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getOutputFormatIcon()}
                Your Customized Rules Package
              </CardTitle>
              <CardDescription>
                {getOutputFormatDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!generatedPackage ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    Ready to generate your personalized CodePilotRules package based on your selections.
                  </div>
                  <Button 
                    onClick={handleGeneratePackage}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating Package...
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        Generate Rules Package
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-sm text-success bg-success/10 p-3 rounded-md dark:bg-success/10">
                    ✅ Package generated successfully!
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Package Size:</span>
                      <span>{generatedPackage.fileSize ? `${(generatedPackage.fileSize / 1024).toFixed(1)} KB` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rules Included:</span>
                      <span>{generatedPackage.ruleCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Format:</span>
                      <span className="uppercase">{generatedPackage.packageType || 'ZIP'}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      if (generatedPackage.downloadUrl) {
                        window.open(generatedPackage.downloadUrl, '_blank')
                      }
                    }}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Package
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">What&apos;s Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Tailored AI assistant rules for your tech stack</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Configuration files for development tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Setup instructions and best practices</span>
                </div>
                {data.environmentDetails.includeDocumentation && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Comprehensive documentation</span>
                  </div>
                )}
                {data.environmentDetails.includeDevDependencies && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Development dependencies and tools</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="text-sm text-muted-foreground">
          {isLastStep ? (
            generatedPackage ? 
              'Package ready for download!' : 
              'Generate your package to complete the setup'
          ) : ''}
        </div>
      </div>
    </div>
  )
} 