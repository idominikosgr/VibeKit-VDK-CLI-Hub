export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    github: string
    twitter: string
  }
  nav: {
    title: string
    href: string
    disabled?: boolean
  }[]
}

export const siteConfig: SiteConfig = {
  name: "Vibe Coding Rules Hub",
  description: "A comprehensive hub for AI-assisted development rules and guidelines.",
  url: "https://hub.vibecodingrules.rocks",
  ogImage: "/og.jpg",
  links: {
    github: "https://github.com/idominikosgr/Vibe-Coding-Rules-hub",
    twitter: "https://twitter.com/vibecodingrules"
  },
  nav: [
    {
      title: "Rules",
      href: "/rules",
    },
    {
      title: "Framework",
      href: "/framework",
    },
    {
      title: "Hub",
      href: "/hub",
    },
    {
      title: "Rule Generator",
      href: "/setup",
    },
    {
      title: "Documentation",
      href: "/docs"
    },
  ],
}
