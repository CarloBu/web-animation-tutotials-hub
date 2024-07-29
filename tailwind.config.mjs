/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      outline: {
        red: "1px solid red", // This defines a new outline utility
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        colors: {
          inherit: "inherit",
          "light-primary": "#FF685B",
          "dark-primary": "#DC3325",
          "light-bg": "white",
          "dark-bg": "#222222",
          "light-text": "#09090b",
          "light-gray-text": "#707070",
          "dark-text": "#ecf1f9",
          "dark-gray-text": "#cacaca",
        },
      },
    },
  },
  plugins: [],
};
