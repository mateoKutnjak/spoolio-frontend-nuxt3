import { acceptHMRUpdate, defineStore } from 'pinia'

interface ILoginResponse {
    access_token: string,
    refresh_token: string,
    user: IUserResponse | undefined
}

interface IUserResponse {
    id: number,
    email: string,
    is_staff: boolean,
    profile: IProfileResponse | undefined
}

interface IProfileResponse {
    first_name: string,
    last_name: string,
    phone_number: string,
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
        async login(email: string | undefined, password: string | undefined) {
            return new Promise((resolve, reject) => {
                $fetch<ILoginResponse>('http://localhost:8000/auth/login/', {
                    method: 'POST', body: {
                        email: email,
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

        async register(email: string | undefined, password: string | undefined, confirmPassword: string | undefined) {
            return new Promise((resolve, reject) => {
                $fetch<ILoginResponse>('http://localhost:8000/auth/registration/', {
                    method: 'POST', body: {
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
