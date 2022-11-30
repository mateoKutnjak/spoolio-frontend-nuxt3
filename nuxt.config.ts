// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@formkit/nuxt',
        'nuxt-icon',
        '@formkit/auto-animate',
        '@nuxt/image-edge',
    ],
    formkit: {
        configFile: './formkit.config.js',
    },
    css: ['~/assets/css/tailwind.css'],
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: '~/tailwind.config.js',
        exposeConfig: false,
        injectPosition: 0,
        viewer: true,
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    app: {
        head: {
            title: "Spoolio",
            meta: [
                { name: 'description', content: 'Create anything' }
            ],
            link: [
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
            ]
        }
    }
})