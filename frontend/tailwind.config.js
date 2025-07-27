/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
      },
      animation: {
        floatUp: 'floatUp 0.8s ease',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
   
    colors: {
      custom: '#ef4444', // Use hex instead of oklch(0.7 0.2 30)
    },
  
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.bg-clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
        },
        '.text-transparent': {
          '-webkit-text-fill-color': 'transparent',
        },
      });
    },
  ],
};