const defaultTheme = require('tailwindcss/defaultTheme');
const aspectRatio = require('@tailwindcss/aspect-ratio');
const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    aspectRatio,
    forms,
    typography,
  ],
};
