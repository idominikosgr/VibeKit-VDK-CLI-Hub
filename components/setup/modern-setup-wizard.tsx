"use client"

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProjectInfoStep } from './wizard-steps/project-info-step'
import { StackSelectionStep } from './wizard-steps/stack-selection-step'
import { LanguageSelectionStep } from './wizard-steps/language-selection-step'
import { ToolPreferencesStep } from './wizard-steps/tool-preferences-step'
import { EnvironmentStep } from './wizard-steps/environment-step'
import { PreviewStep } from './wizard-steps/preview-step'
import type { StepData } from './wizard-steps/types'
import { CheckCircle, Circle, ChevronRight, Sparkles } from 'lucide-react'

const WIZARD_STEPS = [
  {
    id: 'project-info',
    title: 'Project Info',
    component: ProjectInfoStep,
    description: 'Basic project information'
  },
  {
    id: 'stack-selection',
    title: 'Technology Stack',
    component: StackSelectionStep,
    description: 'Choose your tech stack'
  },
  {
    id: 'language-selection',
    title: 'Programming Languages',
    component: LanguageSelectionStep,
    description: 'Select languages you use'
  },
  {
    id: 'tool-preferences',
    title: 'Development Tools',
    component: ToolPreferencesStep,
    description: 'Configure your tools'
  },
  {
    id: 'environment',
    title: 'Environment Setup',
    component: EnvironmentStep,
    description: 'Setup environment details'
  },
  {
    id: 'preview',
    title: 'Review & Generate',
    component: PreviewStep,
    description: 'Review and generate rules'
  },
] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const stepVariants = {
  enter: { opacity: 0, x: 100, scale: 0.95 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -100, scale: 0.95 }
};

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
    <motion.div 
      className="max-w-5xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Progress Bar */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-surface-1/80 to-surface-2/60 dark:from-surface-1/80 dark:to-surface-2/60 backdrop-blur-sm border-2 border-border/20 shadow-xl">
          <CardContent className="pt-8 pb-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-lg font-semibold text-primary">
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                </motion.div>
                <motion.span 
                  className="text-sm font-medium text-muted-foreground px-3 py-1 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 dark:from-accent/10 dark:to-primary/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {Math.round(progressPercentage)}% Complete
                </motion.span>
              </div>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="origin-left"
              >
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-gradient-to-r from-muted to-muted/80 dark:from-muted/30 dark:to-muted/20"
                />
              </motion.div>
              
              {/* Step indicators */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, staggerChildren: 0.05 }}
              >
                {WIZARD_STEPS.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className={`group cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-accent/20 to-primary/20 dark:from-accent/10 dark:to-primary/10 border border-accent dark:border-accent/50'
                        : index < currentStep
                        ? 'bg-gradient-to-r from-success/20 to-success/30 dark:from-success/10 dark:to-success/20 border border-success/50 dark:border-success/30'
                        : 'bg-surface-2 dark:bg-surface-3/50 border border-border hover:bg-muted dark:hover:bg-surface-3/70'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {index < currentStep ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Circle className={`w-4 h-4 ${
                          index === currentStep 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`} />
                      )}
                      <span className={`text-xs font-medium ${
                        index <= currentStep 
                          ? index === currentStep
                            ? 'text-primary'
                            : 'text-success'
                          : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    <p className={`text-xs ${
                      index <= currentStep 
                        ? 'text-foreground/70'
                        : 'text-muted-foreground'
                    }`}>
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Current Step Content */}
      <motion.div variants={itemVariants}>
        <Card className="min-h-[700px] bg-gradient-to-br from-surface-1/80 to-surface-2/60 dark:from-surface-1/80 dark:to-surface-2/60 backdrop-blur-sm border-2 border-border/20 shadow-xl overflow-hidden">
          <div className="relative p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
            
            <div className="relative">
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  >
                    <span className="text-primary-foreground font-bold text-sm">{currentStep + 1}</span>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-primary">
                    {currentStepData.title}
                  </h2>
                </div>
                <p className="text-muted-foreground text-lg">
                  {currentStepData.description}
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3
                  }}
                >
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Step Navigation Dots */}
      <motion.div 
        className="flex justify-center space-x-3"
        variants={itemVariants}
      >
        {WIZARD_STEPS.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'bg-gradient-to-r from-primary to-accent scale-125 shadow-lg'
                : index < currentStep
                ? 'bg-gradient-to-r from-success/80 to-success'
                : 'bg-muted hover:bg-muted/80'
            }`}
            whileHover={{ scale: index === currentStep ? 1.25 : 1.1 }}
            whileTap={{ scale: index === currentStep ? 1.15 : 1.05 }}
            aria-label={`Go to step ${index + 1}: ${WIZARD_STEPS[index].title}`}
          >
            {index === currentStep && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
} 