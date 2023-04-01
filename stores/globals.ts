import { acceptHMRUpdate, defineStore } from 'pinia'
import { DimensionUnit, RotationUnit } from '~~/utils/enums';

export const useGlobalsStore = defineStore('globals', {
    state: () => ({
        dimensionUnit: DimensionUnit.mms,
        rotationUnit: RotationUnit.degrees,
    }),

    getters: {
        getDimensionUnit: (state) => state.dimensionUnit,
        getRotationUnit: (state) => state.rotationUnit,
    },

    actions: {
        setDimensionUnit(dimensionUnit: DimensionUnit) {
            this.dimensionUnit = dimensionUnit;
        },
        setRotationUnit(rotationUnit: RotationUnit) {
            this.rotationUnit = rotationUnit;
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGlobalsStore, import.meta.hot))
}
