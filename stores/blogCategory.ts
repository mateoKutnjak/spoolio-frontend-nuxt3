import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { IBlogCategory, IBlogSubcategory } from '~~/constants/data'

export const useBlogCategoryStore = defineStore('blog-category', {
    state: () => ({
        categories: [] as IBlogCategory[],
        subcategories: [] as IBlogSubcategory[]
    }),

    getters: {
        getCategories: (state) => state.categories,
        getSubcategories: (state) => state.subcategories,
    },

    actions: {

        async fetchSubcategories() {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IBlogSubcategory[]>(new Promise((resolve, reject) => {
                customFetch<IBlogSubcategory[]>(`api/blog/subcategories/`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IBlogSubcategory[]) => {
                    this.subcategories = response

                    this.categories = response.map(el => el.category).filter((value, index, array) => {
                        return array.map(el => el.id).indexOf(value.id) === index;
                    });

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBlogCategoryStore, import.meta.hot))
}
