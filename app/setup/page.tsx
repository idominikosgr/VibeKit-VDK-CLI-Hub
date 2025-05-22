import { Metadata } from "next"
import { ModernSetupWizard } from "@/components/setup/modern-setup-wizard"

export const metadata: Metadata = {
  title: "Setup Wizard",
  description: "Configure and download CodePilotRules for your project",
}

export default function SetupPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center gap-8 text-center mb-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Setup Wizard
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px]">
            Configure and download CodePilotRules tailored to your project needs.
            Follow our step-by-step wizard to generate a personalized rules package.
          </p>
        </div>
      </div>

      <ModernSetupWizard />
    </div>
  )
}
