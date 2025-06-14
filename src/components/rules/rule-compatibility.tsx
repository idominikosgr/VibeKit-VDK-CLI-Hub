import { cn } from "@/lib/utils"

interface RuleCompatibilityProps {
  compatibility?: {
    ides?: string[] | null
    aiAssistants?: string[] | null
    frameworks?: string[] | null
  } | null
}

export function RuleCompatibility({ compatibility }: RuleCompatibilityProps) {
  // If no compatibility info is provided, show a message
  if (!compatibility) {
    return (
      <div className="p-4 text-muted-foreground text-center">
        No compatibility information available for this rule.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {compatibility.ides && compatibility.ides.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-medium">IDEs & Text Rules</h3>
          <div className="flex flex-wrap gap-2">
            {compatibility.ides.map((ide) => (
              <CompatibilityBadge key={ide} name={formatName(ide)} />
            ))}
          </div>
        </div>
      )}

      {compatibility.aiAssistants && compatibility.aiAssistants.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-medium">AI Assistants</h3>
          <div className="flex flex-wrap gap-2">
            {compatibility.aiAssistants.map((assistant) => (
              <CompatibilityBadge key={assistant} name={formatName(assistant)} />
            ))}
          </div>
        </div>
      )}

      {compatibility.frameworks && compatibility.frameworks.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-medium">Frameworks & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {compatibility.frameworks.map((framework) => (
              <CompatibilityBadge
                key={framework}
                name={formatName(framework)}
                isUniversal={framework === "all"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CompatibilityBadge({
  name,
  isUniversal = false
}: {
  name: string
  isUniversal?: boolean
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        isUniversal
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-background"
      )}
    >
      {name}
    </div>
  )
}

// Format names from kebab-case or lowercase to Title Case
function formatName(name: string): string {
  const formattedNames: { [key: string]: string } = {
    "vscode": "VS Code",
    "intellij": "IntelliJ IDEA",
    "webstorm": "WebStorm",
    "cursor": "Cursor",
    "cursor-ai": "Cursor AI",
    "github-copilot": "GitHub Copilot",
    "windsurf": "Windsurf",
    "codewhisperer": "CodeWhisperer",
    "xcode": "Xcode",
    "appcode": "AppCode",
    "nextjs": "Next.js",
    "nestjs": "NestJS",
    "swiftui": "SwiftUI",
    "uikit": "UIKit",
    "all": "All Frameworks"
  }

  return formattedNames[name] || name.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
