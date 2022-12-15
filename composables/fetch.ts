import { useAuthStore } from "~~/stores/auth";

export const customFetch = $fetch.create({
    async onRequest({ options }) {

        // * HERE WE MUST DO JWT TOKEN REFRESH

        const authStore = useAuthStore();
        if (!authStore.accessToken) return;
        options.headers = new Headers(options.headers);
        options.headers.set("Authorization", `Bearer ${authStore.accessToken}`);
    },
});