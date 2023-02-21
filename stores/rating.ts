import { acceptHMRUpdate, defineStore } from 'pinia'
import { HTTP_REQUEST_TIMEOUT, PAGE_SIZE } from '~~/constants/constants'
import { promiseWithTimeout } from '~~/utils/promise'
import { IUserResponse, useAuthStore } from './auth'

export default interface IRatingResponse {
    id: number,
    content: string,
    value: number,
    user: IUserResponse | number,
    content_type: string,
    object_id: number,
    created_at: string,
    updated_at: string,
}

export interface IRatingListResponse {
    count: number,
    next: string,
    previous: string,
    results: IRatingResponse[]
}

export const useRatingStore = defineStore('rating', {
    state: () => ({
        count: undefined as number | undefined,
        next: undefined as string | undefined,
        previous: undefined as string | undefined,
        ratings: [] as IRatingResponse[]
    }),

    getters: {
        getAll: (state) => state,
        getCount: (state) => state.count || 0,
    },

    actions: {
        async fetchRatings(objectId: number, contentType: string, limit: number = PAGE_SIZE, offset: number = 0, append: boolean = false) {
            return promiseWithTimeout<IRatingListResponse>(
                new Promise<IRatingListResponse>((resolve, reject) => {
                    customFetch<IRatingListResponse>(`http://localhost:8000/api/ratings/?content_type=${contentType}&object_id=${objectId}&limit=${limit}&offset=${offset}`, { // ~ Don't end url with / (slash) before simple error is resolved in django
                        method: 'GET',
                    }
                    ).then((response: IRatingListResponse) => {
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

            return promiseWithTimeout(new Promise<IRatingResponse>((resolve, reject) => {
                customFetch<IRatingResponse>(`http://localhost:8000/api/ratings/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    },
                    body: body,
                }
                ).then((response: IRatingResponse) => {
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
