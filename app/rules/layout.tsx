import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rules Catalog",
  description: "Browse the complete collection of CodePilotRules.",
}

export default function RulesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rules-layout">
      {children}
    </div>
  )
}
