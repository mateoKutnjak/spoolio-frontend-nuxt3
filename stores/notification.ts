import { acceptHMRUpdate, defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        isOpened: false,
        message: "",
        type: ToastLevelType.debug
    }),

    getters: {
        getState: (state) => state,
        getIsOpened: (state) => state.isOpened,
        getType: (state) => state.type,
    },

    actions: {
        show(message: string, type = ToastLevelType.debug) {
            this.isOpened = true;
            this.message = message;
            this.type = type;
        },
        showFetchError(err: any, type = ToastLevelType.error) {
            this.isOpened = true;
            this.type = type;

            if (!err.statusMessage) {
                this.message = "Could not reach server. Please try again later"
            } else if (err.statusMessage && err.statusCode) {
                this.message = err.statusMessage + " (" + err.statusCode + ")"
            } else {
                this.message = err;
            }
            console.log(err);
        },
        close() {
            this.isOpened = false;
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
