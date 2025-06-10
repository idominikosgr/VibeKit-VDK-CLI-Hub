"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WizardStepProps } from './types'

interface PackageManager {
  id: string
  name: string
  description: string
  icon: string
}

interface IDE {
  id: string
  name: string
  description: string
  icon: string
}

interface AIAssistant {
  id: string
  name: string
  description: string
  icon: string
}

interface OutputFormat {
  id: string
  name: string
  description: string
  icon: string
}

const packageManagers: PackageManager[] = [
  {
    id: 'npm',
    name: 'npm',
    description: 'Node Package Manager (default)',
    icon: '📦'
  },
  {
    id: 'yarn',
    name: 'Yarn',
    description: 'Fast, reliable dependency manager',
    icon: '🧶'
  },
  {
    id: 'pnpm',
    name: 'pnpm',
    description: 'Fast, disk space efficient package manager',
    icon: '⚡'
  }
]

const IDEs: IDE[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first code editor with .mdc support',
    icon: '🎯'
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Popular editor with AI extensions',
    icon: '💻'
  },
  {
    id: 'webstorm',
    name: 'WebStorm',
    description: 'JetBrains IDE for web development',
    icon: '🌊'
  },
  {
    id: 'general',
    name: 'Other/General',
    description: 'Standard markdown format',
    icon: '📝'
  }
]

const AIAssistants: AIAssistant[] = [
  {
    id: 'vibecoding',
    name: 'Vibe Coding',
    description: 'Cursor\'s built-in AI assistant',
    icon: '🤖'
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'GitHub\'s AI pair programmer',
    icon: '🐙'
  },
  {
    id: 'codewhisperer',
    name: 'CodeWhisperer',
    description: 'Amazon\'s AI coding companion',
    icon: '💭'
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    description: 'AI assistant for code completion',
    icon: '⚡'
  },
  {
    id: 'general',
    name: 'Other/General',
    description: 'Compatible with any AI assistant',
    icon: '🎯'
  }
]

const outputFormats: OutputFormat[] = [
  {
    id: 'bash',
    name: 'Bash Script',
    description: 'Executable setup script',
    icon: '🔧'
  },
  {
    id: 'zip',
    name: 'ZIP Archive',
    description: 'Complete file package',
    icon: '📦'
  },
  {
    id: 'config',
    name: 'Config Files',
    description: 'Individual configuration files',
    icon: '⚙️'
  }
]

export function EnvironmentSetupStep({
  data,
  onNext,
  onBack,
  onUpdateData,
  currentStep,
  totalSteps
}: WizardStepProps) {
  const handleChange = (field: string, value: string) => {
    onUpdateData({
      environmentDetails: {
        ...data.environmentDetails,
        [field]: value
      }
    })
  }

  const isValid = data.environmentDetails.packageManager && 
                  data.environmentDetails.targetIde && 
                  data.environmentDetails.targetAI && 
                  data.environmentDetails.outputFormat

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Environment Setup</h2>
        <p className="text-muted-foreground">
          Configure your development environment preferences for optimized rule generation.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Package Manager</h3>
          <div className="grid grid-cols-3 gap-3">
            {packageManagers.map((manager) => (
              <Card
                key={manager.id}
                className={`cursor-pointer transition-all ${
                  data.environmentDetails.packageManager === manager.id
                    ? 'ring-2 ring-success border-success'
                    : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleChange('packageManager', manager.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{manager.icon}</div>
                  <div className="font-medium">{manager.name}</div>
                  <div className="text-sm text-muted-foreground">{manager.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Target IDE</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Choose your primary development environment to optimize rule formats
          </p>
          <div className="grid grid-cols-2 gap-3">
            {IDEs.map((ide) => (
              <Card
                key={ide.id}
                className={`cursor-pointer transition-all ${
                  data.environmentDetails.targetIde === ide.id
                    ? 'ring-2 ring-success border-success'
                    : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleChange('targetIde', ide.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{ide.icon}</div>
                  <div className="font-medium">{ide.name}</div>
                  <div className="text-sm text-muted-foreground">{ide.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">AI Assistant</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Select your preferred AI coding assistant for optimized integration
          </p>
          <div className="grid grid-cols-2 gap-3">
            {AIAssistants.map((assistant) => (
              <Card
                key={assistant.id}
                className={`cursor-pointer transition-all ${
                  data.environmentDetails.targetAI === assistant.id
                    ? 'ring-2 ring-success border-success'
                    : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleChange('targetAI', assistant.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{assistant.icon}</div>
                  <div className="font-medium">{assistant.name}</div>
                  <div className="text-sm text-muted-foreground">{assistant.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Output Format</h3>
          <div className="grid grid-cols-3 gap-3">
            {outputFormats.map((format) => (
              <Card
                key={format.id}
                className={`cursor-pointer transition-all ${
                  data.environmentDetails.outputFormat === format.id
                    ? 'ring-2 ring-success border-success'
                    : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleChange('outputFormat', format.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{format.icon}</div>
                  <div className="font-medium">{format.name}</div>
                  <div className="text-sm text-muted-foreground">{format.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
        <Button onClick={onNext} disabled={!isValid}>
          Next
        </Button>
      </div>
    </div>
  )
} 