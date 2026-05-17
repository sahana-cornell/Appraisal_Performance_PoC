/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        critical: '#dc2626',
        warning: '#f59e0b',
        healthy: '#10b981',
        neutral: '#6b7280'
      }
    },
  },
  plugins: [],
}
