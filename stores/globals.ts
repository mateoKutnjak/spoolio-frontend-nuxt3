import { acceptHMRUpdate, defineStore } from 'pinia'
import { Language } from '~~/constants/constants';
import { DimensionUnit, RotationUnit } from '~~/utils/enums';

export const useGlobalsStore = defineStore('globals', {

    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
        }),
    },

    state: () => ({
        dimensionUnit: DimensionUnit.mms,
        rotationUnit: RotationUnit.degrees,
        language: Language.croatian,
    }),

    getters: {
        getDimensionUnit: (state) => state.dimensionUnit,
        getRotationUnit: (state) => state.rotationUnit,
        getLanguage: (state) => state.language,
    },

    actions: {
        setDimensionUnit(dimensionUnit: DimensionUnit) {
            this.dimensionUnit = dimensionUnit;
        },
        setRotationUnit(rotationUnit: RotationUnit) {
            this.rotationUnit = rotationUnit;
        },
        setLanguage(language: Language) {
            this.language = language;
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGlobalsStore, import.meta.hot))
}
