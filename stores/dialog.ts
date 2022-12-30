import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', {
    state: () => ({
        isOpened: false,
        componentName: "",
        componentProps: undefined,
        widthClass: "",
        closeOnClickOutside: true,
    }),

    getters: {
        isDialogOpened: (state) => state.isOpened,
    },

    actions: {
        close() {
            this.isOpened = false;
        },
        toggle() {
            if (this.isOpened == undefined) {
                this.isOpened = true;
            } else {
                this.isOpened = !this.isOpened;
            }
        },
        open(componentName: string, componentProps: any, widthClass: string = "md", closeOnClickOutside = true) {
            this.isOpened = true;
            this.componentName = componentName;
            this.componentProps = componentProps;
            this.widthClass = widthClass
            this.closeOnClickOutside = closeOnClickOutside;
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDialogStore, import.meta.hot))
}
