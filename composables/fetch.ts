import { useAuthStore } from "~~/stores/auth";
import { useDialogStore } from "~~/stores/dialog";
import { useNotificationStore } from "~~/stores/notification";
import { ofetch } from 'ofetch'

interface IRefreshTokenResponse {
    access: string,
    access_token_expiration: string
}

export const customFetch = ofetch.create({

    async onRequest({ request, options }) {

        // * Request interception
        // * 
        // * Before every fetch access token verification request is performed
        // * If token is not valid, token refreshing request is performed
        // * After successfull token refreshing, original request should be performed

        const controller = new AbortController();

        const authStore = useAuthStore();
        const dialogStore = useDialogStore();
        const notificationStore = useNotificationStore();

        options.signal = controller.signal;

        if (!authStore.accessToken || !authStore.user) {
            console.log("onRequest interceptor - access token not present");
            return;
        };

        await $fetch('http://localhost:8000/auth/token/verify/', {
            method: 'POST',
            body: {
                token: authStore.accessToken
            }
        }).then(res => {

            // * Add authorization headers (only if access token is verified) 

            options.headers = new Headers(options.headers);
            options.headers.set("Authorization", `Bearer ${authStore.accessToken}`);
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

                    // * Add authorization headers (only if access token is updated) 

                    options.headers = new Headers(options.headers);
                    options.headers.set("Authorization", `Bearer ${authStore.accessToken}`);
                }).catch(err => {
                    debugger;
                    if (err.statusCode === 401) {

                        // * Token has expired. Try request without any auth tokens, but clean user data (logout)

                        controller.abort();
                        dialogStore.close()
                        notificationStore.show('Cannot perform request. Session expired. Please login again', ToastLevel.info());
                    }

                    // * Abort request if refreshing token has failed

                    // todo if we abort here nothing will get fetched
                    // controller.abort();
                    // console.log(`Error happened. Aborting original request ${request}`);
                })
            }
        });
    },

    onResponseError(context) {

    },
});