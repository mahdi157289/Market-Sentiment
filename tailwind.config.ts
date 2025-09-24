import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a',
        },
        error: {
          DEFAULT: '#dc2626',
        },
        warning: {
          DEFAULT: '#ca8a04',
        },
        background: {
          DEFAULT: '#000000'
        },
        text: {
          DEFAULT: '#f3f4f6' // light gray/white
        }
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }
    }
  },
  plugins: []
} satisfies Config;



