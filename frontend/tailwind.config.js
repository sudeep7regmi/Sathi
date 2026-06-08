/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        acc: {
          DEFAULT: '#13a04a', 50: '#e9f9ef', 100: '#c5edd4', 300: '#5fd592',
          600: '#0f8a3e', 700: '#0c6f32',
        },
      },
      spacing: { 13: '3.25rem' },
    },
  },
  plugins: [],
};
