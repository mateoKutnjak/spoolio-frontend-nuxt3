import formKitTailwind from '@formkit/themes/tailwindcss'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",

        './formkit.config.js'
    ],
    theme: {
        extend: {},
    },
    plugins: [
        formKitTailwind,
        require("@tailwindcss/typography"),
        require('@tailwindcss/line-clamp'),
        daisyui
    ],
    daisyui: {
        base: false,
        themes: [
            {
                mytheme: {
                    "primary": "#e17d4e",
                    "secondary": "#f6d860",
                    "accent": "#37cdbe",
                    "neutral": "#3d4451",
                    'info': '#00a7e1',
                    "success": '#09bc8a',
                    "base-100": "#ffffff",
                },
            },
        ],
    },
    darkMode: 'class'
}