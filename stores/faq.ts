import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT, PAGE_SIZE } from '~~/constants/constants'
import { IFaqBlog, IFaqCategory, IPaginatedResponse } from '~~/constants/data'

export const useFaqStore = defineStore('faq', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        blog: null as IFaqBlog | null,
        faqBlogs: [] as IFaqBlog[],
        faqCategories: [] as IFaqCategory[],
    }),

    getters: {
        getPaginatedFaqBlogs: (state) => state.faqBlogs,
        getFaqCategories: (state) => state.faqCategories,
        getFaqCategoryById: (state) => {
            return (categoryId: number) => state.faqCategories.find((item) => item.id === categoryId);
        },
        getFaqCategoryByName: (state) => {
            return (categoryName: string) => state.faqCategories.find((item) => item.name === categoryName);
        },
        getBlog: (state) => state.blog,
    },

    actions: {

        async fetchCategories(): Promise<IFaqCategory[]> {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IFaqCategory[]>(new Promise((resolve, reject) => {
                customFetch<IFaqCategory[]>(`api/faq/categories/`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IFaqCategory[]) => {
                    this.faqCategories = response

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchPaginated(limit: number = PAGE_SIZE, offset: number = 0, category: string = '', append: boolean = false): Promise<IPaginatedResponse<IFaqBlog>> {

            const config = useRuntimeConfig();

            var url = `api/faq/blogs/?limit=${limit}&offset=${offset}&category=${category}`;

            return promiseWithTimeout<IPaginatedResponse<IFaqBlog>>(new Promise((resolve, reject) => {
                customFetch<IPaginatedResponse<IFaqBlog>>(url, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPaginatedResponse<IFaqBlog>) => {
                    this.count = response.count;
                    this.next = response.next;
                    this.previous = response.previous;

                    if (append) {
                        this.faqBlogs = [...this.faqBlogs, ...response.results];
                    } else {
                        this.faqBlogs = response.results;
                    }

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetch(id: number): Promise<IFaqBlog> {

            const config = useRuntimeConfig();

            var url = `api/faq/blogs/${id}/`;

            return promiseWithTimeout<IFaqBlog>(new Promise((resolve, reject) => {
                customFetch<IFaqBlog>(url, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IFaqBlog) => {
                    this.blog = response;

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFaqStore, import.meta.hot))
}
