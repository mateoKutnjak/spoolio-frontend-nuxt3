import { acceptHMRUpdate, defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        isOpened: false,
        message: "",
        iconName: "",
        iconColor: "",
        backgroundColor: ''
    }),

    getters: {
        getState: (state) => state,
        getIsOpened: (state) => state.isOpened
    },

    actions: {
        show(message: string, type = ToastLevel.debug()) {
            this.isOpened = true;
            this.message = message;
            this.iconName = type.iconName;
            this.backgroundColor = type.backgroundColor;
            this.iconColor = type.iconColor;
        },
        showFetchError(err: any, type = ToastLevel.error()) {
            this.isOpened = true;
            this.iconName = type.iconName;
            this.backgroundColor = type.backgroundColor;
            this.iconColor = type.iconColor;

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
