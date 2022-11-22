import { acceptHMRUpdate, defineStore } from 'pinia'

interface IPrintOrderResponse {
    comment: string,
}

interface IPrintOrderListResponse {
    count: number,
    next: string,
    previous: string,
    results: IPrintOrderResponse[]
}

export const usePrintOrderStore = defineStore('print-order', {
    state: () => ({
        createdPrintOrder: undefined as IPrintOrderResponse | undefined
        // count: undefined as number | undefined,
        // next: undefined as string | undefined,
        // previous: undefined as string | undefined,
        // printOrders: [] as IPrintOrderResponse[]
    }),

    getters: {
        getCreatedPrintOrder: (state) => state.createdPrintOrder,
    },

    actions: {
        async createPrintOrder(email: string, firstName: string, lastName: string, address: string, phoneNumber: string, comment: string = '') {
            return new Promise((resolve, reject) => {
                $fetch<IPrintOrderResponse>('http://localhost:8000/api/print-orders/', {
                    method: 'POST',
                    body: {
                        user_profile: {
                            email: email,
                            first_name: firstName,
                            last_name: lastName,
                            address: address,
                            phone_number: phoneNumber,
                        },
                        comment: comment,
                    }
                }).then((response: IPrintOrderResponse) => {
                    this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            });
        }
        // async fetchPaginatedBlogs(limit: number = 10, offset: number = 0, search: string = '', append: boolean = false) {
        //     return new Promise((resolve, reject) => {
        //         $fetch<IBlogListResponse>(`http://localhost:8000/api/blogs/?limit=${limit}&offset=${offset}&search=${search}`, {
        //             method: 'GET'
        //         }
        //         ).then((response: IBlogListResponse) => {
        //             this.count = response.count;
        //             this.next = response.next;
        //             this.previous = response.previous;

        //             if (append) {
        //                 this.blogs = [...this.blogs, ...response.results];
        //             } else {
        //                 this.blogs = response.results;
        //             }

        //             resolve(response)
        //         }).catch(err => {
        //             // ! needs proper error handling
        //             alert("TODO error handling")
        //             reject(err)
        //         })
        //     })
        // },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderStore, import.meta.hot))
}
