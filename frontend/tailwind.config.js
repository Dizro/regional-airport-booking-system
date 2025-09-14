/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        'brand-dark': '#1E293B',
        'brand-blue': '#2563EA',
        'brand-blue-light': '#E9EFFD',
        'brand-gray': '#9A9FA7',
        'brand-light-gray': '#DDDFE2',
        'brand-bg': '#F6F6F7',
      }
    },
  },
  plugins: [],
}