import { acceptHMRUpdate, defineStore } from 'pinia'

interface ILoginResponse {
    data: {
        access_token: string,
        refresh_token: string,
        user: IUserResponse | undefined
    }
}

interface IUserResponse {
    username: string,
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: undefined as string | undefined,
        refreshToken: undefined as string | undefined,
        user: undefined as IUserResponse | undefined
    }),

    // state: () => {
    //     return {
    //         // all these properties will have their type inferred automatically
    //         accessToken: '',
    //         refreshToken: '',
    //         user: null
    //     }
    // },

    getters: {
        getUser: (state) => state.user,
        loggedIn: (state) => state.accessToken != null
    },

    actions: {
        async login(userCredentials: { username: string | undefined; password: string | undefined }) {
            return new Promise((resolve, reject) => {
                $fetch<ILoginResponse>('http://localhost:8000/auth/login/', {
                    method: 'POST', body: {
                        username: userCredentials.username,
                        password: userCredentials.password,
                    }
                }
                ).then((response: ILoginResponse) => {
                    this.accessToken = response.data.access_token
                    this.refreshToken = response.data.refresh_token
                    this.user = response.data.user;
                    resolve(response)
                }).catch(err => {
                    // ! needs proper error handling
                    alert("TODO error handling")
                    reject(err)
                })
            })
        },

        logout() {
            if (this.loggedIn) {
                this.accessToken = undefined
                this.refreshToken = undefined
                this.user = undefined;
            }
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
