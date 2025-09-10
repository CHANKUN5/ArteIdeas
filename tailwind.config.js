/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DD1E3',
        secondary: '#FF9912', 
        dark: '#1a1a1a',
        light: '#ffffff',
      },
      fontFamily: {
        'vietnam': ['Be Vietnam Pro', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(10deg)',
            opacity: '1'
          }
        }
      }
    },
  },
  plugins: [],
}