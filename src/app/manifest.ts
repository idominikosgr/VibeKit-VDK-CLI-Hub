import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VIbeKit VDK",
    short_name: "VIbeKit VDK",
    description: "VIbeKit VDK: World's first VDK for AI-powered development",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563EB",
    orientation: "portrait-primary",
    categories: ["coding", "rules", "vibe"],
    lang: "en-US",
    dir: "ltr",
    scope: "/",
    id: "vibekit-vdk",
    prefer_related_applications: false,
    related_applications: [],
    shortcuts: [
      {
        name: "Rules",
        url: "/rules",
        description: "View all rules",
      },
      {
        name: "Docs",
        url: "/docs",
        description: "View all docs",
      },
      {
        name: "Main",
        url: "/hub",
        description: "View main page",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/main.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Main page",
      },
      {
        src: "/screenshots/docs.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Docs page",
      },
      {
        src: "/screenshots/rules.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Property search and filtering",
      },
      {
        src: "/screenshots/profile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "User profile on mobile",
      },
      {
        src: "/screenshots/messages-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Messages interface on mobile",
      },
    ],
    icons: [
      {
        src: "/images/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
