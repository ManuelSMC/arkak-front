/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dbf0e3',
          200: '#b7e1c7',
          300: '#86cba5',
          400: '#52b788',
          500: '#2d9a6a',
          600: '#2d6a4f',
          700: '#245740',
          800: '#1e4535',
          900: '#19382c',
        },
        earth: {
          50: '#f8f6f3',
          100: '#f0f4f0',
          200: '#e2e8de',
          300: '#b7c9b0',
          400: '#96ae8d',
          500: '#7a956f',
          600: '#617858',
          700: '#4d5f46',
          800: '#3f4d3a',
          900: '#354031',
        },
        surface: '#f0f4f0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(45,106,79,0.08)',
        elevated: '0 8px 32px rgba(45,106,79,0.12)',
      },
    },
  },
  plugins: [],
}
