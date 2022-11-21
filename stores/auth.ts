import { acceptHMRUpdate, defineStore } from 'pinia'

interface ILoginResponse {
    access_token: string,
    refresh_token: string,
    user: IUserResponse | undefined
}

interface IUserResponse {
    id: number,
    username: string,
    email: string,
    is_staff: boolean,
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: undefined as string | undefined,
        refreshToken: undefined as string | undefined,
        user: undefined as IUserResponse | undefined
    }),

    getters: {
        getUser: (state) => state.user,
        loggedIn: (state) => state.accessToken != null
    },

    actions: {
        async login(username: string | undefined, password: string | undefined) {
            return new Promise((resolve, reject) => {
                $fetch<ILoginResponse>('http://localhost:8000/auth/login/', {
                    method: 'POST', body: {
                        username: username,
                        password: password,
                    }
                }
                ).then((response: ILoginResponse) => {
                    this.accessToken = response.access_token
                    this.refreshToken = response.refresh_token
                    this.user = response.user;
                    resolve(response)
                }).catch(err => {
                    // ! needs proper error handling
                    alert("TODO error handling")
                    reject(err)
                })
            })
        },

        async register(username: string | undefined, email: string | undefined, password: string | undefined, confirmPassword: string | undefined) {
            return new Promise((resolve, reject) => {
                $fetch<ILoginResponse>('http://localhost:8000/auth/registration/', {
                    method: 'POST', body: {
                        username: username,
                        email: email,
                        password1: password,
                        password2: confirmPassword,

                    }
                }
                ).then((response: ILoginResponse) => {
                    this.accessToken = response.access_token
                    this.refreshToken = response.refresh_token
                    this.user = response.user;
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
