/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
         primary: {
  50:  '#e9f5fb',  // very light blue
  100: '#cfeaf7',  // lighter tint
  200: '#a5d5ee',  // light
  300: '#7abfe5',  // mid-light
  400: '#52a8d7',  // light-medium
  500: '#388fba',  // base color
  600: '#2f7ca3',  // slightly darker
  700: '#256789',  // medium-dark
  800: '#1c526e',  // dark
  900: '#143a4d',  // very dark
  950: '#0b212e',  // deepest shade
},
       secondary: {
  50:  '#fff0ed',
  100: '#ffd9d2',
  200: '#ffb3a6',
  300: '#ff8c7a',
  400: '#ff664d',
  500: '#ff4021', // main secondary
  600: '#e6391e',
  700: '#cc321a',
  800: '#b32b16',
  900: '#801f0f',
  950: '#4d1209',
},

      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-lg': '0 0 40px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
