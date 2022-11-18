import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        refreshToken: null,
        user: null
    }),

    getters: {
        getUser: (state) => state.user
    },

    actions: {
        async login(userCredentials) {
            return new Promise((resolve, reject) => {
                getAPI.post('/login/', {
                    username: userCredentials.username,
                    password: userCredentials.password,
                }).then(response => {
                    this.accessToken = response.data.access_token
                    this.refreshToken = response.data.refresh_token
                    this.user = response.data.user;
                    resolve()
                }).catch(err => {
                    // ! needs proper error handling
                    alert("TODO error handling")
                    reject(err)
                })
            })
        },
        logout() {
            if (getters.loggedIn) {
                this.accessToken = null
                this.refreshToken = null
                this.user = null;
            }
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
