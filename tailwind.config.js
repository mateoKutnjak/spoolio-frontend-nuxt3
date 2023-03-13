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
        themes: ['bumblebee']
    },
    darkMode: 'class'
}