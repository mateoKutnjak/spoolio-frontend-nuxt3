import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_BLOG, HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { promiseWithTimeout } from '~~/utils/promise'
import { IUserResponse, useAuthStore } from './auth'

export default interface ICommentResponse {
    id: number,
    content: string,
    user: IUserResponse | number,
    content_type: string,
    object_id: number,
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
                    customFetch<ICommentListResponse>(`http://localhost:8000/api/comments/?content_type=blog&object_id=${blog}&limit=${limit}&offset=${offset}`, { // ~ Don't end url with / (slash) before simple error is resolved in django
                        method: 'GET',
                    }
                    ).then((response: ICommentListResponse) => {
                        this.count = response.count;
                        this.next = response.next;
                        this.previous = response.previous;

                        if (append)
                        {
                            this.comments = [...this.comments, ...response.results];
                        } else
                        {
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

        async postBlogComment(user: number, content: string, blogId: number,) {
            const authStore = useAuthStore();

            var body: { [name: string]: any } = {
                user: user,
                content: content,
                content_type: CONTENT_TYPE_BLOG,
                object_id: blogId,
            };

            return promiseWithTimeout(new Promise<ICommentResponse>((resolve, reject) => {
                customFetch<ICommentResponse>(`http://localhost:8000/api/comments/`, {
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

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useCommentListStore, import.meta.hot))
}
