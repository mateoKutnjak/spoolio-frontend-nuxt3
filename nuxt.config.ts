// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@formkit/nuxt'],
    formkit: {
        configFile: './formkit.config.ts',
    },
    theme: 'genesis',
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