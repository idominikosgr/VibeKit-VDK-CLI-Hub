import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Discord | VibeKit VDK Hub",
  description: "Join our Discord community to discuss AI-assisted development and coding rules.",
}

export default function DiscordPage() {
  // For now, redirect to GitHub until we have a Discord server set up
  redirect("https://github.com/idominikosgr/VibeKit-VDK-Hub/discussions")
} 