/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          primary: '#9333ea',
          secondary: '#a855f7',
          dark: '#7c3aed',
        },
        green: {
          primary: '#10b981',
          secondary: '#34d399',
        },
      },
    },
  },
  plugins: [],
}

