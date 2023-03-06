// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@formkit/nuxt',
        'nuxt-icon',
        '@formkit/auto-animate',
        '@nuxt/image-edge',
        'nuxt-vue3-google-signin'
    ],
    // googleSignIn: {
    //     clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    // },
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
    build: {
        transpile: ['three']
    },
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict',
        },
        storage: 'localStorage'
    },
    components: {
        global: true,
        dirs: ['~/components']
    }, // * this configuration resolvers warning and error: "resolveComponent can only be used in render() or setup()""
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
    },
    runtimeConfig: {
        googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        stripeSecretKeyTest: process.env.STRIPE_SECRET_KEY_TEST,
        public: {
            stripePublishableKeyTest: process.env.STRIPE_PUBLISHABLE_KEY_TEST
        }
    },
})