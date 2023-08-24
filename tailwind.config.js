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
        container: {
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        }
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
                    "primary": "#EF7745",
                    "secondary": "#C05321",
                    "accent": "#0FA3B1",
                    "neutral": "#D9E5D6",
                    "error": '#e75f6b',
                    'info': '#4489C5',
                    "success": '#679436',
                    "warning": '#dcab18',
                    "base-100": "#FFFAF9",
                    "base-content": "#191816",
                    
                    ".btn": {
                        "font-weight": 500
                    },

                    ".btn-primary": {
                        "color": "white",
                    },
                    ".btn-error": {
                        "color": "white",
                    },
                },
            },
        ],
    },
    darkMode: 'class'
}