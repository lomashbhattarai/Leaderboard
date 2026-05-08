/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--app-bg)",
          soft: "var(--app-bg-soft)",
          surface: "var(--app-surface)",
          raised: "var(--app-surface-raised)",
          inset: "var(--app-surface-inset)",
          border: "var(--app-border)",
          text: "var(--app-text)",
          muted: "var(--app-text-muted)",
          faint: "var(--app-text-faint)",
          accent: "var(--app-accent)",
          positive: "var(--app-positive)",
          negative: "var(--app-negative)",
          warning: "var(--app-warning)",
        },
      },
      borderRadius: {
        app: "var(--app-radius)",
      },
      boxShadow: {
        app: "var(--app-shadow-md)",
      },
      transitionTimingFunction: {
        app: "var(--app-motion-easing)",
      },
    },
  },
  plugins: [],
}
