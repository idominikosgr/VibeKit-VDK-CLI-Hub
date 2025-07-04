export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    twitter: string;
  };
  nav: {
    title: string;
    href: string;
    disabled?: boolean;
  }[];
};

export const siteConfig: SiteConfig = {
  name: "VibeKit VDK Hub",
  description:
    "Web platform for browsing, customizing, and generating VDK rules",
  url: "https://vdk.tools",
  ogImage: "/og.jpg",
  links: {
    github: "https://github.com/idominikosgr/VibeKit-VDK-Hub",
    twitter: "https://twitter.com/YourNewHandle",
  },
  nav: [
    {
      title: "Rules",
      href: "/rules",
    },
    {
      title: "Toolkit",
      href: "/toolkit",
    },
    {
      title: "Hub",
      href: "/hub",
    },
    {
      title: "Generate",
      href: "/generate",
    },
    {
      title: "Docs",
      href: "/docs",
    },
  ],
};
