/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');
import PrimeUI from 'tailwindcss-primeui';

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       poppins: ['"Poppins"', ...fontFamily.sans],
  //     },
  //   },
  // },
  plugins: [PrimeUI, require('@tailwindcss/forms')],
};
