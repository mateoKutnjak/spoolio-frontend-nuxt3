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
        'nuxt-vue3-google-signin',
        '@nuxtjs/color-mode',
        '@nuxtjs/google-fonts',
        '@nuxtjs/i18n',
    ],
    i18n: {
        locales: ['en', 'hr'],  // used in URL path prefix
        defaultLocale: 'hr',    // default locale of your project for Nuxt pages and routings
        vueI18n: './i18n.config.ts',
    },
    colorMode: {
        preference: 'light',
        fallback: 'light',
        classSuffix: ''
    },
    googleSignIn: {
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    },
    googleFonts: {
        families: {
            Poppins: {
                wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
            },
            Rajdhani: {
                wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
            },
        }
    },
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
            title: "UR3D",
            meta: [
                { name: 'description', content: 'Create anything' }
            ],
            link: [
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
            ]
        },
        pageTransition: {
            name: 'page',
            mode: 'out-in'
        }
    },
    runtimeConfig: {
        googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        // stripeSecretKeyTest: process.env.STRIPE_SECRET_KEY_TEST,
        public: {
            stripePublishableApiKey: process.env.PRODUCTION === "0" ? process.env.STRIPE_PUBLISHABLE_KEY_TEST : process.env.STRIPE_PUBLISHABLE_KEY_LIVE,
            baseURL: process.env.PRODUCTION === "0" ? process.env.BASE_URL_DEV : process.env.BASE_URL,
            baseWsURL: process.env.PRODUCTION === "0" ? process.env.BASE_WS_URL_DEV : process.env.BASE_WS_URL,
        }
    },
})