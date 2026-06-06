/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sleek Charcoal / Slate colors for premium dark design
        dark: {
          bg: '#0F172A',      // Slate 900
          card: '#1E293B',    // Slate 800
          border: '#334155',  // Slate 700
          text: '#F8FAFC',    // Slate 50
          muted: '#94A3B8'    // Slate 400
        },
        light: {
          bg: '#F8FAFC',      // Slate 50
          card: '#FFFFFF',    // White
          border: '#E2E8F0',  // Slate 200
          text: '#0F172A',    // Slate 900
          muted: '#64748B'    // Slate 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
