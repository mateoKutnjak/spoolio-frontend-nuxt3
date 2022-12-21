import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', {
    state: () => ({
        isOpened: false,
        useFullWidth: false,
        componentName: "",
        componentProps: undefined
    }),

    getters: {
        isDialogOpened: (state) => state.isOpened,
    },

    actions: {
        close() {
            this.isOpened = false;
        },
        toggle() {
            if (this.isOpened == undefined)
            {
                this.isOpened = true;
            } else
            {
                this.isOpened = !this.isOpened;
            }
        },
        open(componentName: string, componentProps: any, useFullWidth: boolean = false) {
            this.componentName = componentName;
            this.isOpened = true;
            this.useFullWidth = useFullWidth
            this.componentProps = componentProps;
        }
    },
})

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useDialogStore, import.meta.hot))
}
