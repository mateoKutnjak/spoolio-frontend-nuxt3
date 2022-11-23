import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', {
    state: () => ({
        isOpened: undefined as boolean | undefined,
    }),

    getters: {
        isDrawerOpened: (state) => state.isOpened,
    },

    actions: {
        toggle() {
            if (this.isOpened == undefined)
            {
                this.isOpened = true;
            } else
            {
                this.isOpened = !this.isOpened;
            }
        }
    },
})

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useDrawerStore, import.meta.hot))
}
