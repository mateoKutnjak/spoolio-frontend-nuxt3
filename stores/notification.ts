import { acceptHMRUpdate, defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        isOpened: false,
        message: "",
        type: ToastLevel.debug(),
    }),

    getters: {
        getState: (state) => state,
        getIsOpened: (state) => state.isOpened
    },

    actions: {
        show(message: string, type = ToastLevel.debug()) {
            console.log("showing " + message);

            this.isOpened = true;
            this.message = message;
            this.type = type;
        },
        close() {
            this.isOpened = false;
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
