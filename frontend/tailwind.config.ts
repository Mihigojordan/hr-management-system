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
          50: '#fff3e6', 
          100: '#ffe0bf',
          200: '#ffc680',
          300: '#ffa94d',
          400: '#ff8c1a',
          500: '#ff7300',
          600: '#e66300',
          700: '#cc5500',
          800: '#b34700',
          900: '#802f00',
          950: '#4d1b00',
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
