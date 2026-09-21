export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'dj-navy': '#2e2a5c',
        'dj-purple': '#7b5ea7',
        'dj-yellow': '#f4d35e',
        'dj-pink': '#f4c2c2',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        hand: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
}