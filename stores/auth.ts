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
    id: number,
    first_name: string,
    last_name: string,
    address: string,
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

        async patchProfile(firstName: string, lastName: string, address: string, phoneNumber: string) {

            return new Promise((resolve, reject) => {

                if (!this.user || !this.accessToken) {
                    reject('Not logged in')
                }

                var body: { [name: string]: any } = {
                    first_name: firstName,
                    last_name: lastName,
                    address: address,
                    phone_number: phoneNumber,
                };

                // * Remove all key-value pairs where value is null
                // * because these empty values can be patched if 
                // * not removed

                for (const key in body) {
                    if (body[key] === null) {
                        delete body[key];
                    }
                }

                // todo check user? nullable
                $fetch<IProfileResponse>(`http://localhost:8000/api/user-profile/${this.user?.profile?.id}/`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    },
                    body: body,
                })
                    .then((response: IProfileResponse) => {
                        // todo remove !
                        this.user = { ...this.user! }
                        this.user.profile = response;
                        resolve(response)
                    }).catch(err => {
                        // ! needs proper error handling
                        alert("TODO error handling")
                        reject(err)
                    })
            });
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
