/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Mauritania Flag Colors
        mauritania: {
          green: '#00A651',
          gold: '#FFD100',
          red: '#CE1126',
          'green-light': '#00C853',
          'green-dark': '#008E3A',
          'gold-light': '#FFE082',
          'gold-dark': '#FFB300',
          'red-light': '#E53935',
          'red-dark': '#B71C1C',
        }
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'serif'],
        english: ['Inter', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00A651, 0 0 10px #00A651, 0 0 15px #00A651' },
          '100%': { boxShadow: '0 0 10px #00A651, 0 0 20px #00A651, 0 0 30px #00A651' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mauritania-pattern': 'linear-gradient(45deg, #00A651 25%, transparent 25%), linear-gradient(-45deg, #00A651 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #00A651 75%), linear-gradient(-45deg, transparent 75%, #00A651 75%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
} 