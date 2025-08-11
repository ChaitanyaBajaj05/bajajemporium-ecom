module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        heroZoom: {
          '0%': { transform: 'scale(1.13)' },
          '100%': { transform: 'scale(1.00)' },
        },
      },
      animation: {
        heroZoom: 'heroZoom 1.1s cubic-bezier(0.4,0,0.2,1) forwards',
      },
    },
  },
  plugins: [],
}
