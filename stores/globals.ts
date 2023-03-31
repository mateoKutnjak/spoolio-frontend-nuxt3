import { acceptHMRUpdate, defineStore } from 'pinia'
import { DimensionUnit } from '~~/utils/enums';

export const useGlobalsStore = defineStore('globals', {
    state: () => ({
        dimensionUnit: DimensionUnit.mms,
        backgroundColor: "#f8f9fa"
    }),

    getters: {
        getDimensionUnit: (state) => state.dimensionUnit,
        getBackgroundColor: (state) => state.backgroundColor,
    },

    actions: {
        setDimensionUnit(dimensionUnit: DimensionUnit) {
            this.dimensionUnit = dimensionUnit;
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGlobalsStore, import.meta.hot))
}
