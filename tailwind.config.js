/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './scripts/**/*.js'], // Adjust paths as per your project
  theme: {
   
      extend: {
        backgroundImage: {
          'hero-pattern': "url('/img/hero-pattern.svg')",
          'footer-texture': "url('/img/footer-texture.png')",
        }
      },
    
    extend: {},
  },
  plugins: [],
};
