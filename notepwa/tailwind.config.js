/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ef4444',
          blue: '#3b82f6',
          green: '#10b981',
        },
      },
    },
  },
  plugins: [],
}