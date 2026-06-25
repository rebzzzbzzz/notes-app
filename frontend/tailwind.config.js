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
        'bg-main': '#eef2f7',
        'bg-card': '#ffffff',
        'bg-form': '#f8faff',
        'bg-tag': '#e2e8f0',
        'text-primary': '#1e293b',
        'text-secondary': '#475569',
        'text-muted': '#94a3b8',
        'border-light': '#dce4ed',
        'accent-blue': '#4a6fa5',
        'accent-blue-hover': '#3b5d8a',
        'accent-blue-light': '#dbe7f5',
        'danger': '#b91c1c',
      }
    },
  },
  plugins: [],
}