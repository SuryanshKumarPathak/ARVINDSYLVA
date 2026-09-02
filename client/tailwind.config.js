/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f0',
          100: '#dceddc',
          200: '#b8dabc',
          300: '#8bc294',
          400: '#5da86b',
          500: '#3d8c4d',
          600: '#2e703c',
          700: '#255931',
          800: '#1e4527',
          900: '#183720',
          950: '#0d2114',
        },
        gold: {
          50:  '#fdf9ee',
          100: '#f9f0d0',
          200: '#f2de9d',
          300: '#e9c760',
          400: '#e2b030',
          500: '#c9941c',
          600: '#ad7414',
          700: '#8a5613',
          800: '#714415',
          900: '#5e3915',
          950: '#371d08',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#faf6ec',
          200: '#f4ecd5',
          300: '#ebdcb7',
          400: '#dec893',
          500: '#d0b470',
        },
        stone: {
          850: '#1c1c1a',
          950: '#0f0f0e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'luxury': '0 4px 24px -4px rgba(0,0,0,0.15), 0 1px 4px -1px rgba(0,0,0,0.08)',
        'luxury-lg': '0 12px 48px -8px rgba(0,0,0,0.2), 0 4px 12px -2px rgba(0,0,0,0.1)',
        'gold': '0 4px 20px -4px rgba(201,148,28,0.3)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
