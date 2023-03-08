import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT, PAGE_SIZE } from '~~/constants/constants'
import { IComment, IPaginatedResponse, IUser } from '~~/constants/data'
import { promiseWithTimeout } from '~~/utils/promise'
import { useAuthStore } from './auth'

export const useCommentListStore = defineStore('comment-list', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        comments: [] as IComment[]
    }),

    getters: {
        getComments: (state) => state,
        getCommentCount: (state) => state.count || 0,
    },

    actions: {
        async fetchComments(objectId: number, contentType: string, limit: number = PAGE_SIZE, offset: number = 0, append: boolean = false) {

            const config = useRuntimeConfig();
            

            return promiseWithTimeout<IPaginatedResponse<IComment>>(
                new Promise<IPaginatedResponse<IComment>>((resolve, reject) => {
                    customFetch<IPaginatedResponse<IComment>>(`api/comments/?content_type=${contentType}&object_id=${objectId}&limit=${limit}&offset=${offset}`, { // ~ Don't end url with / (slash) before simple error is resolved in django
                        baseURL: config.public.baseURL,
                        method: 'GET',
                    }
                    ).then((response: IPaginatedResponse<IComment>) => {
                        this.count = response.count;
                        this.next = response.next;
                        this.previous = response.previous;

                        if (append) {
                            this.comments = [...this.comments, ...response.results];
                        } else {
                            this.comments = response.results;
                        }

                        console.log(response);

                        resolve(response)
                    }).catch(err => {
                        reject(err)
                    })
                }),
                HTTP_REQUEST_TIMEOUT,
            );
        },

        async postComment(user: number, content: string, objectId: number, contentType: string) {

            const config = useRuntimeConfig();
            
            const authStore = useAuthStore();

            var body: { [name: string]: any } = {
                user: user,
                content: content,
                content_type: contentType,
                object_id: objectId,
            };

            return promiseWithTimeout(new Promise<IComment>((resolve, reject) => {
                customFetch<IComment>(`api/comments/`, {
                    baseURL: config.public.baseURL,
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: body,
                }
                ).then((response: IComment) => {
                    this.comments.unshift(response);
                    this.count = this.count || 0 + 1;
                    // todo what to do with next ?
                    // todo what to do with previous ?
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCommentListStore, import.meta.hot))
}
