import { useAuthStore } from "~~/stores/auth";

interface IRefreshTokenResponse {
    access: string,
    access_token_expiration: string
}

export const customFetch = $fetch.create({

    async onRequest({ request, options }) {
        
        // * Request interception
        // * 
        // * Before every fetch access token verification request is performed
        // * If token is not valid, token refreshing request is performed
        // * After successfull token refreshing, original request should be performed

        const controller = new AbortController();
        const authStore = useAuthStore();

        if (!authStore.accessToken) {
            console.log("onRequest interceptor - access token not present");
            return;
        };

        await $fetch('http://localhost:8000/auth/token/verify/', {
            method: 'POST',
            body: {
                token: authStore.accessToken
            }
        }).catch(async err => {
            if (err.statusCode === 401) {

                // * Send token refresh request only when status 
                // * code 401 is returned for token verification

                await $fetch<IRefreshTokenResponse>('http://localhost:8000/auth/token/refresh/', {
                    method: 'POST',
                    body: {
                        refresh: authStore.refreshToken
                    }
                }).then(async (response: IRefreshTokenResponse) => {
                    
                    // * Update new access token to auth store.
                    
                    authStore.updateAccessToken(response.access);
                    console.log("Success. Saving to authStore");
                }).catch(err => {

                    // * Abort request if refreshing token has failed
                    controller.abort();
                    console.log(`Error happened. Aborting original request ${request}`);
                })
            }
        });

        // * Add authorization headers (only if access token is present) 

        options.headers = new Headers(options.headers);
        options.headers.set("Authorization", `Bearer ${authStore.accessToken}`);
    },
});