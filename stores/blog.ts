import { acceptHMRUpdate, defineStore } from 'pinia'
import IUserResponse from './auth'

export default interface IBlogResponse {
    id: number,
    title: string,
    subtitle: string,
    content: string,
    author: IUserResponse,
    created_at: string,
    updated_at: string,
}

export const useBlogStore = defineStore('blog', {
    state: () => ({
        blog: undefined as IBlogResponse | undefined
    }),

    getters: {
        getBlog: (state) => state.blog,
    },

    actions: {
        async fetchBlog(id: number) {
            return new Promise<IBlogResponse>((resolve, reject) => {
                $fetch<IBlogResponse>(`http://localhost:8000/api/blogs/${id}/`, {
                    method: 'GET'
                }
                ).then((response: IBlogResponse) => {
                    this.blog = response;
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
    import.meta.hot.accept(acceptHMRUpdate(useBlogStore, import.meta.hot))
}
