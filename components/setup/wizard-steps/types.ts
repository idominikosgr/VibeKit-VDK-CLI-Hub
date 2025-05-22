import type { WizardConfigurationDb } from '@/lib/services/rule-generator'

// Step data structure for each wizard step
export interface StepData {
  projectInfo: {
    name: string
    description?: string
  }
  stackChoices: Record<string, boolean>
  languageChoices: Record<string, boolean>
  toolPreferences: Record<string, boolean>
  environmentDetails: Record<string, string | number | boolean>
}

// Export WizardConfiguration for use in wizard components
export type { WizardConfigurationDb }

// Props interface for each wizard step component
export interface WizardStepProps {
  data: StepData
  onNext: () => void
  onBack: () => void
  onUpdateData: (stepData: Partial<StepData>) => void
  isFirstStep?: boolean
  isLastStep?: boolean
  currentStep: number
  totalSteps: number
}

// Wizard navigation state
export interface WizardState {
  currentStep: number
  completed: boolean
  data: StepData
  isSubmitting: boolean
}

// Stack option definition
export interface StackOption {
  id: string
  name: string
  description: string
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile'
  languages: string[]
  popular?: boolean
  icon?: string
}

// Language option definition
export interface LanguageOption {
  id: string
  name: string
  description: string
  category: 'web' | 'mobile' | 'systems' | 'data' | 'other'
  extensions: string[]
  popular?: boolean
  frameworks?: string[]
}

// Tool option definition
export interface ToolOption {
  id: string
  name: string
  description: string
  category: 'linting' | 'formatting' | 'testing' | 'bundling' | 'deployment' | 'other'
  requiredFor?: string[]
  optional?: boolean
} 