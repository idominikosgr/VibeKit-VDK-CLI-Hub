import type { Config } from 'tailwindcss';

// Minimal config for Tailwind CSS v4.1+
// Most configuration is now done in CSS using @theme
const config: Config = {
  // Content detection is automatic in v4.1+, no need to specify paths
  // unless you want to override the defaults
  
  // Dark mode is now handled via CSS @media or .dark class
  // No need for darkMode configuration
  
  // Only include this config if you need:
  // 1. Third-party plugins that require JS configuration
  // 2. Advanced customization not possible in CSS

  plugins: [
    // Only add plugins that actually require JS configuration
    // Most built-in features are now in core Tailwind
    require('@tailwindcss/typography'), // Required for prose classes
    // require('@tailwindcss/forms'),      // Example if needed
  ],
};

export default config;