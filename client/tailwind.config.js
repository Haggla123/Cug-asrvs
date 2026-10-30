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
        // Catholic University of Ghana Crest Palette
        "cug-red": "#c41118",
        "cug-burgundy": "#003318",
        "cug-crimson": "#c41118",
        "cug-gold": "#c8a951",            // Official CUG website gold
        "cug-gold-hover": "#b8983e",      // Gold hover state
        "cug-gold-light": "#fbf8f0",      // Warm gold surface tint
        "cug-darkgold": "#775A00",
        "cug-green": "#004C23",           // Official CUG green (from cug.edu.gh meta theme)
        "cug-green-light": "#006830",     // Hover green
        "cug-green-dark": "#003318",      // Dark forest green (header / overlay)
        "cug-green-deep": "#002411",      // Deepest green accent
        "cug-charcoal": "#111C2D",

        // Institutional Semantic Tokens
        "surface-bright": "#f9f9ff",
        "primary-fixed-dim": "#9fc8a9",
        "secondary": "#775a00",
        "on-tertiary-fixed-variant": "#3a485c",
        "on-background": "#111c2d",
        "outline-variant": "#d5dfd7",
        "inverse-primary": "#9fc8a9",
        "on-secondary-fixed-variant": "#5a4300",
        "on-primary-container": "#c5dec9",
        "on-tertiary": "#ffffff",
        "tertiary": "#002411",
        "on-primary-fixed-variant": "#003318",
        "on-surface": "#14231a",
        "primary": "#004C23",
        "primary-container": "#003318",
        "tertiary-container": "#002411",
        "tertiary-fixed-dim": "#b9c7e0",
        "surface": "#f8faf8",
        "error": "#c41118",
        "secondary-container": "#fbf8f0",
        "error-container": "#ffdad6",
        "surface-container-low": "#f2f6f3",
        "surface-container": "#e8efe9",
        "on-secondary-fixed": "#251a00",
        "outline": "#627365",
        "on-primary-fixed": "#002411",
        "on-secondary-container": "#735700",
        "on-error": "#ffffff",
        "surface-variant": "#dce7de",
        "surface-container-highest": "#dce7de",
        "on-secondary": "#ffffff",
        "surface-container-high": "#dfe9e1",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#002411",
        "surface-dim": "#d0d9d1",
        "inverse-surface": "#1d2b21",
        "secondary-fixed": "#fbf8f0",
        "on-error-container": "#93000a",
        "on-surface-variant": "#48564c",
        "on-tertiary-container": "#97a5bd",
        "background": "#f8faf8",
        "primary-fixed": "#c5dec9",
        "tertiary-fixed": "#d5e3fd",
        "surface-tint": "#004C23",
        "inverse-on-surface": "#ecf1ff",
        "secondary-fixed-dim": "#c8a951",
        "surface-container-lowest": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
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
        "sans": ["Public Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
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
      },
      fontSize: {
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "22px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg-mobile": ["30px", { lineHeight: "38px", fontWeight: "600" }],
        "title-lg": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "label-lg": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "500" }],
        "display-lg": ["40px", { lineHeight: "48px", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "title-sm": ["14px", { lineHeight: "20px", fontWeight: "600" }]
      }
    },
  },
  plugins: [],
}
