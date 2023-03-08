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

            const config = useRuntimeConfig();

            var body: { [name: string]: any } = {
                author: author,
                blog: blog,
                content: content,
            };

            return promiseWithTimeout<IComment>(new Promise<IComment>((resolve, reject) => {
                customFetch<IComment>(`api/comments/`, {
                    baseURL: config.public.baseURL,
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
