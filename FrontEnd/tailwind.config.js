/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)'  }
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)'   }
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)'    }
        },
        'count-up': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)'   },
          '50%':      { opacity: '0.5', transform: 'scale(1.4)' }
        },
        'shimmer': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)'  }
        }
      },
      animation: {
        'fade-up':    'fade-up 0.5s ease-out forwards',
        'fade-in':    'fade-in 0.4s ease-out forwards',
        'slide-down': 'slide-down 0.4s ease-out forwards',
        'scale-in':   'scale-in 0.3s ease-out forwards',
        'pulse-dot':  'pulse-dot 1.5s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}