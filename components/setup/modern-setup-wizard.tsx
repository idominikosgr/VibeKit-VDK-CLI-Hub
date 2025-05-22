"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProjectInfoStep } from './wizard-steps/project-info-step'
import { StackSelectionStep } from './wizard-steps/stack-selection-step'
import { LanguageSelectionStep } from './wizard-steps/language-selection-step'
import { ToolPreferencesStep } from './wizard-steps/tool-preferences-step'
import { EnvironmentStep } from './wizard-steps/environment-step'
import { PreviewStep } from './wizard-steps/preview-step'
import type { StepData } from './wizard-steps/types'

const WIZARD_STEPS = [
  {
    id: 'project-info',
    title: 'Project Info',
    component: ProjectInfoStep,
  },
  {
    id: 'stack-selection',
    title: 'Technology Stack',
    component: StackSelectionStep,
  },
  {
    id: 'language-selection',
    title: 'Programming Languages',
    component: LanguageSelectionStep,
  },
  {
    id: 'tool-preferences',
    title: 'Development Tools',
    component: ToolPreferencesStep,
  },
  {
    id: 'environment',
    title: 'Environment Setup',
    component: EnvironmentStep,
  },
  {
    id: 'preview',
    title: 'Review & Generate',
    component: PreviewStep,
  },
] as const

export function ModernSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState<StepData>({
    projectInfo: {
      name: '',
      description: ''
    },
    stackChoices: {},
    languageChoices: {},
    toolPreferences: {},
    environmentDetails: {}
  })

  const totalSteps = WIZARD_STEPS.length

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep, totalSteps])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const handleUpdateData = useCallback((stepData: Partial<StepData>) => {
    setWizardData(prev => ({
      ...prev,
      ...stepData
    }))
  }, [])

  const currentStepData = WIZARD_STEPS[currentStep]
  const CurrentStepComponent = currentStepData.component

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {WIZARD_STEPS.map((step, index) => (
                <span 
                  key={step.id}
                  className={`${index <= currentStep ? 'text-primary font-medium' : ''}`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card className="min-h-[600px]">
        <CardContent className="p-8">
          <CurrentStepComponent
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
            onUpdateData={handleUpdateData}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === totalSteps - 1}
            currentStep={currentStep + 1}
            totalSteps={totalSteps}
          />
        </CardContent>
      </Card>

      {/* Step Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {WIZARD_STEPS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentStep
                ? 'bg-primary'
                : index < currentStep
                ? 'bg-primary/60'
                : 'bg-muted-foreground/30'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
} 