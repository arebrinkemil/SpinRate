import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
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
        hallon: '#CE2D4F',
      },
    },
  },
  plugins: [],
} satisfies Config
