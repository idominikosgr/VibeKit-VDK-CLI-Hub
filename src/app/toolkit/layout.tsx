import { Metadata } from "next";

const title = "VibeKit VDK CLI - Project-Aware AI Intelligence";
const description =
  "Advanced Command-line toolkit that analyzes your codebase and deploys project-aware rules to any AI coding assistant - VDK is the world's first Vibe Development Kit.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "VibeKit VDK CLI",
    "CLI tool",
    "project-aware AI",
    "automated AI setup",
    "intelligent coding assistant",
    "AI context generation",
    "development automation",
    "AI-assisted programming",
    "context-aware rules",
    "systematic AI intelligence",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
        width: 1200,
        height: 630,
        alt: "VibeKit VDK CLI - Project-Aware AI Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description
      )}`,
    ],
  },
  alternates: {
    canonical: "/toolkit",
  },
};

export default function FrameworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
