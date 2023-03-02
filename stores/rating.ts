import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT, PAGE_SIZE } from '~~/constants/constants'
import { IPaginatedResponse, IRating } from '~~/constants/data'
import { promiseWithTimeout } from '~~/utils/promise'
import { useAuthStore } from './auth'

export const useRatingStore = defineStore('rating', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        ratings: [] as IRating[]
    }),

    getters: {
        getAll: (state) => state,
        getCount: (state) => state.count || 0,
    },

    actions: {
        async fetchRatings(objectId: number, contentType: string, limit: number = PAGE_SIZE, offset: number = 0, append: boolean = false) {
            return promiseWithTimeout<IPaginatedResponse<IRating>>(
                new Promise<IPaginatedResponse<IRating>>((resolve, reject) => {
                    customFetch<IPaginatedResponse<IRating>>(`http://localhost:8000/api/ratings/?content_type=${contentType}&object_id=${objectId}&limit=${limit}&offset=${offset}`, { // ~ Don't end url with / (slash) before simple error is resolved in django
                        method: 'GET',
                    }
                    ).then((response: IPaginatedResponse<IRating>) => {
                        this.count = response.count;
                        this.next = response.next;
                        this.previous = response.previous;

                        if (append) {
                            this.ratings = [...this.ratings, ...response.results];
                        } else {
                            this.ratings = response.results;
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

        async postRating(user: number, content: string, value: number, objectId: number, contentType: string) {
            const authStore = useAuthStore();

            var body: { [name: string]: any } = {
                user: user,
                content: content,
                value: value,
                content_type: contentType,
                object_id: objectId,
            };

            return promiseWithTimeout(new Promise<IRating>((resolve, reject) => {
                customFetch<IRating>(`http://localhost:8000/api/ratings/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: body,
                }
                ).then((response: IRating) => {
                    this.ratings.unshift(response);
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
    import.meta.hot.accept(acceptHMRUpdate(useRatingStore, import.meta.hot))
}
