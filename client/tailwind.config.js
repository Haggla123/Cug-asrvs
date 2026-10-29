/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Catholic University of Ghana Official Identity (from https://www.cug.edu.gh/)
        "cug-green": "#004C23",          // Official theme color
        "cug-green-dark": "#003318",     // Header & footer deep forest green
        "cug-green-deep": "#002411",     // Deepest accent green
        "cug-green-light": "#006830",    // Hover green
        "cug-gold": "#c8a951",           // Official CUG gold accent
        "cug-gold-hover": "#b8983e",     // Gold hover
        "cug-gold-light": "#fbf8f0",     // Warm gold tinted surface
        "cug-red": "#c41118",            // Crest heraldic red

        // System Semantic Tokens mapped to CUG official colors
        "primary": "#004C23",            // CUG Green
        "primary-container": "#003318",  // Deep CUG Green
        "primary-hover": "#00632e",      // Rich Green Hover
        "on-primary": "#ffffff",

        "secondary": "#c8a951",          // CUG University Gold
        "secondary-hover": "#b8983e",    // Darker Gold Hover
        "secondary-container": "#f8f5eb",// Light Gold Container
        "on-secondary": "#003318",
        "on-secondary-container": "#735700",

        "tertiary": "#002411",
        "tertiary-container": "#143823",
        "on-tertiary": "#ffffff",

        // Surfaces & Backgrounds
        "surface": "#fbfdfb",
        "surface-bright": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f9f4",
        "surface-container": "#eaf3ea",
        "surface-container-high": "#ddedd4",
        "surface-container-highest": "#c8e6c9",
        "background": "#f8faf9",

        // Text & Outlines
        "on-surface": "#0f172a",
        "on-surface-variant": "#334155",
        "outline": "#64748b",
        "outline-variant": "#e2e8f0",

        // Status Semantics
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "margin": "2rem",
        "gutter-mobile": "1rem",
        "space-xl": "2.5rem",
        "space-md": "1rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "margin-mobile": "1rem",
        "gutter": "1.5rem",
        "space-lg": "1.5rem"
      },
      fontFamily: {
        "serif": ["Newsreader", "Georgia", "serif"],
        "sans": ["Public Sans", "Raleway", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        "headline-md": ["Newsreader", "serif"],
        "label-sm": ["Public Sans", "sans-serif"],
        "headline-lg-mobile": ["Newsreader", "serif"],
        "title-md": ["Public Sans", "sans-serif"],
        "body-md": ["Public Sans", "sans-serif"],
        "body-lg": ["Public Sans", "sans-serif"],
        "display-lg-mobile": ["Newsreader", "serif"],
        "title-lg": ["Public Sans", "sans-serif"],
        "headline-lg": ["Newsreader", "serif"],
        "label-lg": ["Public Sans", "sans-serif"],
        "body-sm": ["Public Sans", "sans-serif"],
        "headline-sm": ["Newsreader", "serif"],
        "display-lg": ["Newsreader", "serif"],
        "label-md": ["Public Sans", "sans-serif"],
        "title-sm": ["Public Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}
