/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fdfcf9',
          100: '#f9f6f0',
          200: '#f1ede0',
          300: '#e4dcbe',
          400: '#d1c297',
          500: '#bca674',
          600: '#a3895a',
          700: '#826b47',
          800: '#68563c',
          900: '#564733',
        },
        sand: {
          50: '#fbfaf7',
          100: '#f5f3ec',
          200: '#eae6d7',
          300: '#dbd3be',
          400: '#c8bb9e',
          500: '#b4a180',
          600: '#9d8768',
          700: '#7e6c53',
          800: '#665744',
          900: '#544739',
        },
        kisan: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        anomaly: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
        punjabi: ['"Noto Sans Gurmukhi"', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(22, 163, 74, 0.25)',
        'glow-gold': '0 0 25px -5px rgba(217, 119, 6, 0.25)',
        'soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
