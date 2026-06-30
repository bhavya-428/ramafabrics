/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./admin.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f8c4cd',
          300: '#f393a2',
          400: '#e95d73',
          500: '#9e2d3e',   // Primary light
          600: '#7d1d2b',   // Primary brand maroon
          700: '#58101a',   // Primary dark
          800: '#460810',
          900: '#2d0409',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#230a0d',   // Deep maroon slate dark
          900: '#140204',   // Deep maroon black
          950: '#080001',
        },
        amber: {
          50: '#fefbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#c5a059',   // Brand gold
          600: '#b08a46',
          700: '#8f6e32',
          800: '#6e5323',
          900: '#4d3714',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
