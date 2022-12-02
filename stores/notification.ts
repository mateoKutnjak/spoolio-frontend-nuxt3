import { acceptHMRUpdate, defineStore } from 'pinia'
import { ToastType } from '~~/utils/enums';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        isOpened: false,
        message: "",
        type: ToastType.debug,
    }),

    getters: {
        getState: (state) => state,
        getIsOpened: (state) => state.isOpened
    },

    actions: {
        show(message: string, type = ToastType.debug) {
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
