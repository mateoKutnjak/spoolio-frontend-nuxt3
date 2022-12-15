import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_BLOG, HTTP_REQUEST_TIMEOUT } from '~~/constants/constants'
import { useAuthStore } from './auth'
import IBlogResponse, { ILikeResponse } from './blog'

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
                customFetch<IBlogListResponse>(`http://localhost:8000/api/blogs/?limit=${limit}&offset=${offset}&search=${search}`, {
                    method: 'GET',
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
                    // alert("TODO error handling")
                    reject(err)
                })
            })
        },

        async toggleLike(accessToken: string, blogId: number) {
            const authStore = useAuthStore();

            // todo check if user data exists

            return promiseWithTimeout<ILikeResponse>(
                new Promise<ILikeResponse>((resolve, reject) => {
                    var body: { [name: string]: any } = {
                        object_id: blogId,
                        content_type: CONTENT_TYPE_BLOG,
                        user: authStore.getUser?.id
                    };

                    customFetch<ILikeResponse>(`http://localhost:8000/api/likes/toggle/?content_type=blog&object_id=${blogId}`, { // ~ Don't end url with / (slash) before simple error is resolved in django
                        method: 'POST',
                        body: body,
                    }
                    ).then((response) => {
                        this.blogs.filter((el) => el.id === blogId).forEach(el => {
                            el.liked_by_me = Boolean(response);
                            el.like_count = Boolean(response) ? el.like_count + 1 : el.like_count - 1;
                        });
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
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBlogListStore, import.meta.hot))
}
