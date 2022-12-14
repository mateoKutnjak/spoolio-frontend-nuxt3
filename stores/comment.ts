import { acceptHMRUpdate, defineStore } from 'pinia'
import IUserResponse from './auth'

interface ICommentResponse {
    id: number,
    content: string,
    user: IUserResponse,
    created_at: string,
    updated_at: string,
}

export const useCommentStore = defineStore('comment', {
    state: () => ({
        insertedComment: undefined as ICommentResponse | undefined
    }),

    getters: {
        getInsertedComment: (state) => state.insertedComment,
    },

    actions: {
        async postComment(accessToken: string, author: number, blog: number, content: string) {
            var body: { [name: string]: any } = {
                author: author,
                blog: blog,
                content: content,
            };

            return new Promise<ICommentResponse>((resolve, reject) => setTimeout(() => {
                $fetch<ICommentResponse>(`http://localhost:8000/api/comments/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: body,
                }
                ).then((response: ICommentResponse) => {
                    this.insertedComment = response;
                    resolve(response)
                }).catch(err => {
                    // ! needs proper error handling
                    alert("TODO error handling")
                    reject(err)
                })
            }, 5000))
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCommentStore, import.meta.hot))
}
