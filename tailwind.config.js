/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dj-navy': '#242262',
        'dj-dark': '#181646',
        'dj-purple': '#7b5ea7',
        'dj-lavender': '#a390e4',
        'dj-yellow': '#f3df23',
        'dj-pink': '#f4c2c2',
        'dj-cream': '#fdfbf7',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        hand: ['"Caveat"', 'cursive'],
        retro: ['"VT323"', 'monospace'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px #000000',
        'pixel-lg': '6px 6px 0px #000000',
        'pixel-sm': '2px 2px 0px #000000',
        'pixel-yellow': '4px 4px 0px #f3df23',
      }
    },
  },
  plugins: [],
}
