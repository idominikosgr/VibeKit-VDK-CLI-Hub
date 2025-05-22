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
  name: "CodePilotRules Hub",
  description: "A comprehensive hub for AI-assisted development rules and guidelines.",
  url: "https://codepilotrules.dev",
  ogImage: "/og.jpg",
  links: {
    github: "https://github.com/codepilotrules/codepilotrules-hub",
    twitter: "https://twitter.com/codepilotrules"
  },
  nav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Rules",
      href: "/rules",
    },
    {
      title: "Setup Wizard",
      href: "/setup",
    },
    {
      title: "Documentation",
      href: "/docs",
      disabled: true
    },
  ],
}
