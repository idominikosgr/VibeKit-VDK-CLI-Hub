import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vibe Coding Rules',
    short_name: 'Vibe Coding Rules',
    description:
      'Vibe Coding Rules: A collection of coding rules for Vibe Coding',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563EB',
    orientation: 'portrait-primary',
    categories: ['coding', 'rules', 'vibe'],
    lang: 'en-US',
    dir: 'ltr',
    scope: '/',
    id: 'vibe-coding-rules',
    prefer_related_applications: false,
    related_applications: [],
    shortcuts: [
      {
        name: 'Rules',
        url: '/rules',
        description: 'View all rules',
      },
      {
        name: 'Docs',
        url: '/docs',
        description: 'View all docs',
      },
      {
        name: 'Main',
        url: '/hub',
        description: 'View main page',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/main.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Main page',
      },
      {
        src: '/screenshots/docs.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Docs page',
      },
      {
        src: '/screenshots/rules.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Property search and filtering',
      },
      {
        src: '/screenshots/profile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'User profile on mobile',
      },
      {
        src: '/screenshots/messages-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Messages interface on mobile',
      },
    ],
    icons: [
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
