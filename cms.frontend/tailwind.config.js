/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "Arial", "sans-serif"],
                display: ["Playfair Display", "serif"],
            },
        },
    },
    plugins: [],
};