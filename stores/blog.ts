import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IBlog } from '~~/constants/data';

export const useBlogStore = defineStore('blog', {
    state: () => ({
        blog: undefined as IBlog | undefined
    }),

    getters: {
        getBlog: (state) => state.blog,
    },

    actions: {
        async fetchBlog(id: number) {
            return new Promise<IBlog>((resolve, reject) => {
                customFetch<IBlog>(`http://localhost:8000/api/blogs/${id}/`, {
                    method: 'GET'
                }
                ).then((response: IBlog) => {
                    this.blog = response;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        },

        async patchBlog(accessToken: string, title: string, subtitle: string, content: string) {

            return promiseWithTimeout<IBlog>(new Promise<IBlog>((resolve, reject) => {
                var body: { [name: string]: any } = {
                    title: title,
                    subtitle: subtitle,
                    content: content,
                };

                // todo check user? nullable
                customFetch<IBlog>(`http://localhost:8000/api/blogs/${this.blog?.id}/`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: body,
                })
                    .then((response: IBlog) => {
                        // todo remove !
                        this.blog = response
                        resolve(response)
                    }).catch(err => {
                        // ! needs proper error handling
                        reject(err)
                    })
            }), HTTP_REQUEST_TIMEOUT);
        },

    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBlogStore, import.meta.hot))
}
