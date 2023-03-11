import { ofetch } from 'ofetch'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { IProfile, IUser, IUserLogin } from '~~/constants/data'

export const useAuthStore = defineStore('auth', {
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
        }),
    },

    state: () => ({
        accessToken: undefined as string | undefined,
        refreshToken: undefined as string | undefined,
        user: undefined as IUser | undefined,
    }),

    getters: {
        getUser: (state) => state.user,
        loggedIn: (state) => state.accessToken
    },

    actions: {
        async login(email: string | undefined, password: string | undefined) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IUserLogin>(new Promise((resolve, reject) => {
                ofetch<IUserLogin>('auth/login/', {
                    baseURL: config.public.baseURL,
                    method: 'POST',
                    body: {
                        email: email,
                        password: password,
                    },
                }
                ).then((response: IUserLogin) => {
                    this.accessToken = response.access_token
                    this.refreshToken = response.refresh_token
                    this.user = response.user;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async register(email: string | undefined, password: string | undefined, confirmPassword: string | undefined, invitationToken: string) {
            const config = useRuntimeConfig();

            return promiseWithTimeout<IUserLogin>(new Promise((resolve, reject) => {
                ofetch<IUserLogin>('auth/registration/', {
                    baseURL: config.public.baseURL,
                    method: 'POST', body: {
                        email: email,
                        password1: password,
                        password2: confirmPassword,
                        invitation_token: invitationToken,
                    },
                }
                ).then((response: IUserLogin) => {
                    this.accessToken = response.access_token
                    this.refreshToken = response.refresh_token
                    this.user = response.user;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async registerGoogle(googleAccessToken: String) {
            const config = useRuntimeConfig();
            return promiseWithTimeout<IUserLogin>(new Promise((resolve, reject) => {
                ofetch<IUserLogin>('auth/registration/google/', {
                    baseURL: config.public.baseURL,
                    method: 'POST', body: {
                        access_token: googleAccessToken,

                    }
                }
                ).then((response: IUserLogin) => {
                    this.accessToken = response.access_token
                    this.refreshToken = response.refresh_token
                    this.user = response.user;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async patchUserProfile(body: IProfile) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IProfile>(new Promise((resolve, reject) => {

                if (!this.user || !this.accessToken) {
                    reject('Not logged in')
                }

                // todo check user? nullable
                customFetch<IProfile>(`api/user-profile/${this.user?.profile?.id}/`, {
                    baseURL: config.public.baseURL,
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    },
                    body: body,
                })
                    .then((response: IProfile) => {
                        // todo remove !
                        this.user = { ...this.user! }
                        this.user.profile = response;
                        resolve(response)
                    }).catch(err => {
                        reject(err)
                    })
            }), HTTP_REQUEST_TIMEOUT);
        },

        logout() {
            if (this.loggedIn) {
                this.accessToken = undefined
                this.refreshToken = undefined
                this.user = undefined;
            }
        },

        updateAccessToken(accessToken: string) {
            this.accessToken = accessToken;
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
