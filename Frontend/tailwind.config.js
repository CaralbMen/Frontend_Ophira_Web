/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ophira-bg': {
          'dark': '#0F1218',
          'card': '#1A2332',
          'hover': '#242F3E'
        },
        'ophira-primary': '#00BFFF',
        'ophira-success': '#10D981',
        'ophira-warning': '#FB923C',
        'ophira-danger': '#EF4444',
        'ophira-purple': '#A855F7'
      }
    },
  },
  plugins: [],
}

