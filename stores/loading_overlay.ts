import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLoadingOverlayStore = defineStore('loading-overlay', {
    state: () => ({
        isVisible: false,
    }),

    getters: {
        isDrawerOpened: (state) => state.isVisible,
    },

    actions: {
        close() {
            this.isVisible = false;
        },
        show() {
            this.isVisible = true;
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useLoadingOverlayStore, import.meta.hot))
}
