/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = ['./src/**/*.{js,jsx,ts,tsx}'];
export const theme = {
    extend: {
        screens: {
            '2xl': '1700px',
        },
    },
};
export const plugins = [];