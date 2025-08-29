/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cream-start': '#FFFDD0',
        'cream-end': '#F0EAD6',
        'mint-start': '#E0FFE0',
        'mint-end': '#C8E6C9',
        'lavender-start': '#E6E6FA',
        'lavender-end': '#D8BFD8',
        'coral-start': '#FFDAB9',
        'coral-end': '#F0B7A4',
        'pink-start': '#FFCCE5',
        'pink-end': '#F7A8D8',
        'peach-start': '#FFDAB9',
        'peach-end': '#FFCBA4',
        'aqua-start': '#CCEEFF',
        'aqua-end': '#A4D8ED',
      },
    },
  },
  plugins: [],
};
