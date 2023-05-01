import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_BLOG, HTTP_REQUEST_TIMEOUT, PAGE_SIZE } from '~~/constants/constants'
import { IBlog, ILike, IPaginatedResponse } from '~~/constants/data'
import { useAuthStore } from './auth'

export const useBlogListStore = defineStore('blog-list', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        blogs: [] as IBlog[],
        featuredBlogs: [] as IBlog[]
    }),

    getters: {
        getPaginatedBlogs: (state) => state,
        getFeaturedBlogs: (state) => state.featuredBlogs,
    },

    actions: {
        async fetchPaginatedBlogs(limit: number = 10, offset: number = 0, search: string = '', category: string = '', append: boolean = false) {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IPaginatedResponse<IBlog>>(new Promise((resolve, reject) => {
                customFetch<IPaginatedResponse<IBlog>>(`api/blog/blogs/?limit=${limit}&offset=${offset}&search=${search}&category=${category}`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IPaginatedResponse<IBlog>) => {
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
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchFeaturedBlogs() {

            const config = useRuntimeConfig();

            return promiseWithTimeout<IBlog[]>(new Promise((resolve, reject) => {
                customFetch<IBlog[]>(`api/blog/blogs/?is_featured=true`, {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IBlog[]) => {

                    if (response.length > PAGE_SIZE) {
                        console.warn(`Fetching is_featured returned more element than PAGE_SIZE (${PAGE_SIZE})`)
                    }

                    this.featuredBlogs = response;

                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async toggleLike(accessToken: string, blogId: number) {

            const config = useRuntimeConfig();
            const authStore = useAuthStore();

            // todo check if user data exists

            return promiseWithTimeout<ILike>(
                new Promise<ILike>((resolve, reject) => {
                    var body: { [name: string]: any } = {
                        object_id: blogId,
                        content_type: CONTENT_TYPE_BLOG,
                        user: authStore.getUser?.id
                    };

                    customFetch<ILike>(`api/likes/toggle/?content_type=blog&object_id=${blogId}`, { // ~ Don't end url with / (slash) before simple error is resolved in django
                        baseURL: config.public.baseURL,
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
