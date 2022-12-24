import { acceptHMRUpdate, defineStore } from 'pinia'
import { DimensionUnit } from '~~/utils/enums';

export const useGlobalsStore = defineStore('globals', {
    state: () => ({
        dimensionUnit: DimensionUnit.mms,
    }),

    getters: {
        getDimensionUnit: (state) => state.dimensionUnit,
    },

    actions: {
        setDimensionUnit(dimensionUnit: DimensionUnit) {
            this.dimensionUnit = dimensionUnit;
        },
    },
})

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useGlobalsStore, import.meta.hot))
}
