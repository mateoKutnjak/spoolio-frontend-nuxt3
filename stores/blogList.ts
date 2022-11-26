import { acceptHMRUpdate, defineStore } from 'pinia'
import IBlogResponse from './blog'

interface IBlogListResponse {
    count: number,
    next: string,
    previous: string,
    results: IBlogResponse[]
}

export const useBlogListStore = defineStore('blog-list', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        blogs: [] as IBlogResponse[]
    }),

    getters: {
        getPaginatedBlogs: (state) => state,
    },

    actions: {
        async fetchPaginatedBlogs(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
            return new Promise((resolve, reject) => {
                $fetch<IBlogListResponse>(`http://localhost:8000/api/blogs/?limit=${limit}&offset=${offset}&search=${search}`, {
                    method: 'GET'
                }
                ).then((response: IBlogListResponse) => {
                    this.count = response.count;
                    this.next = response.next;
                    this.previous = response.previous;

                    if (append) {
                        this.blogs = [...this.blogs, ...response.results];
                    } else {
                        this.blogs = response.results;
                    }

                    resolve(response)
                }).catch(err => {
                    // ! needs proper error handling
                    alert("TODO error handling")
                    reject(err)
                })
            })
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBlogListStore, import.meta.hot))
}
