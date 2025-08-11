export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#139ED4",
        dark: {
          bg: "#1a1a2e",
          surface: "#16213e",
          accent: "#0f3460",
          text: "#e2e8f0",
          muted: "#94a3b8"
        }
      },
    },
  },
  plugins: [],
}