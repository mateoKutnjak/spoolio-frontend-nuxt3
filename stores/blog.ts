import { acceptHMRUpdate, defineStore } from 'pinia'
import IUserResponse from './auth'

export default interface IBlogResponse {
    id: number,
    title: string,
    subtitle: string,
    content: string,
    author: IUserResponse,
    likes_count: number,
    comment_count: number,
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

        async patchBlog(accessToken: string, title: string, subtitle: string, content: string) {

            return new Promise((resolve, reject) => {
                var body: { [name: string]: any } = {
                    title: title,
                    subtitle: subtitle,
                    content: content,
                };

                // todo check user? nullable
                $fetch<IBlogResponse>(`http://localhost:8000/api/blogs/${this.blog?.id}/`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: body,
                })
                    .then((response: IBlogResponse) => {
                        // todo remove !
                        this.blog = response
                        resolve(response)
                    }).catch(err => {
                        // ! needs proper error handling
                        alert("TODO error handling")
                        reject(err)
                    })
            });
        },

    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBlogStore, import.meta.hot))
}
