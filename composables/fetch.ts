import { useAuthStore } from "~~/stores/auth";

interface IRefreshTokenResponse {
    access: string,
    access_token_expiration: string
}

export const customFetch = $fetch.create({
    async onRequest({ request, options }) {
        const authStore = useAuthStore();

        if (!authStore.accessToken) {
            console.debug("onRequest interceptor - access token not present");
            return;
        };

        options.headers = new Headers(options.headers);
        options.headers.set("Authorization", `Bearer ${authStore.accessToken}`);
    },

    async onResponse({ request, options, response }) {
        const authStore = useAuthStore();

        if (response.status === 401) {
            console.debug("Need for JWT token refresh");

            await $fetch<IRefreshTokenResponse>('http://localhost:8000/auth/token/refresh/', {
                method: 'POST',
                body: {
                    refresh: authStore.refreshToken
                }
            }).then((response: IRefreshTokenResponse) => {
                console.debug("Success. Saving to authStore");
                authStore.updateAccessToken(response.access);
            }).catch(err => {
                console.debug("Error.");
                console.log(err);
            })
        }
    }
});