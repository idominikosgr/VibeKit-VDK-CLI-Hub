// Wizard Steps - Modern multi-step setup flow
// Following CodePilotRulesHub's "always" principles: complete implementations, no backward compatibility

export { ProjectInfoStep } from './project-info-step'
export { StackSelectionStep } from './stack-selection-step'
export { LanguageSelectionStep } from './language-selection-step'
export { ToolPreferencesStep } from './tool-preferences-step'
export { EnvironmentStep } from './environment-step'
export { PreviewStep } from './preview-step'

// Wizard configuration types
export type { 
  WizardStepProps, 
  StepData, 
  WizardState,
  StackOption,
  LanguageOption,
  ToolOption
} from './types' 