import type { Config } from 'tailwindcss'
const { nextui } = require('@nextui-org/react')

export default {
  content: [
    './app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fragment Mono', 'monospace'],
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#121212',
        gray: '#857885',
        silver: '#B3B2AE',
        lightsilver: '#C1C1BA',
        platinum: '#E9E9E6',
        blue: '#1F7A8C',
        lightblue: '#84B2B9',
        hallon: '#CE2D4F',
        orange: '#ffa400',
      },
    },
    screens: {
      sm: '640px',

      md: '768px',

      lg: '1024px',

      xl: '1280px',
      '2xl': '1600px',
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
} satisfies Config
