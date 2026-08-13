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
        brand: {
          50: '#F8F8F6',
          100: '#F0F0EC',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111111',
          950: '#0A0A0A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#141414',
          subtle: '#F8F8F6',
          'subtle-dark': '#1C1C1C',
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          dark: '#3B82F6',
        },
        success: {
          DEFAULT: '#15803D',
          light: '#F0FDF4',
          border: '#BBF7D0',
        },
        warning: {
          DEFAULT: '#B45309',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        error: {
          DEFAULT: '#B91C1C',
          light: '#FEF2F2',
          border: '#FECACA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'dropdown': '0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
