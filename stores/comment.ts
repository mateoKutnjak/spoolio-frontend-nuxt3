import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IComment } from '~~/constants/data';

export const useCommentStore = defineStore('comment', {
    state: () => ({
        insertedComment: undefined as IComment | undefined
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

            return promiseWithTimeout<IComment>(new Promise<IComment>((resolve, reject) => {
                customFetch<IComment>(`http://localhost:8000/api/comments/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: body,
                }
                ).then((response: IComment) => {
                    this.insertedComment = response;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCommentStore, import.meta.hot))
}
