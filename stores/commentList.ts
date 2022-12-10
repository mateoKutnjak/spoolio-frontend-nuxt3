import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { promiseWithTimeout } from '~~/utils/promise'
import IUserResponse, { useAuthStore } from './auth'

export default interface ICommentResponse {
    id: number,
    content: string,
    author: IUserResponse,
    created_at: string,
    updated_at: string,
}

export interface ICommentListResponse {
    count: number,
    next: string,
    previous: string,
    results: ICommentResponse[]
}

export const useCommentListStore = defineStore('comment-list', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        comments: [] as ICommentResponse[]
    }),

    getters: {
        getComments: (state) => state,
    },

    actions: {
        async fetchComments(blog: number, limit: number = 10, offset: number = 0, append: boolean = false) {

            return promiseWithTimeout<ICommentListResponse>(
                new Promise<ICommentListResponse>((resolve, reject) => {
                    $fetch<ICommentListResponse>(`http://localhost:8000/api/comments/?blog=${blog}&limit=${limit}&offset=${offset}`, { // ~ Don't end url with / (slash) before simple error is resolved in django
                        method: 'GET',
                    }
                    ).then((response: ICommentListResponse) => {
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
                        // ! needs proper error handling
                        alert("TODO error handling")
                        reject(err)
                    })
                }),
                HTTP_REQUEST_TIMEOUT,
            );
        },

        async postComment(author: number, blog: number, content: string) {
            const authStore = useAuthStore();

            var body: { [name: string]: any } = {
                author: author,
                blog: blog,
                content: content,
            };

            return promiseWithTimeout(new Promise<ICommentResponse>((resolve, reject) => {
                $fetch<ICommentResponse>(`http://localhost:8000/api/comments/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: body,
                }
                ).then((response: ICommentResponse) => {
                    this.comments.unshift(response);
                    this.count = this.count || 0 + 1;
                    // todo what to do with next ?
                    // todo what to do with previous ?
                    resolve(response)
                }).catch(err => {
                    // ! needs proper error handling
                    alert("TODO error handling")
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCommentListStore, import.meta.hot))
}
