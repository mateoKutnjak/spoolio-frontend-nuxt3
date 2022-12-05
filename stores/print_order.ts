import { acceptHMRUpdate, defineStore } from 'pinia'

export interface IPrintOrderAttachmentFileResponse {
    file: File,
    comment: string,
    localUrl: string,
}

export interface IPrintOrderAttachmentImageResponse {
    image: File,
    comment: string,
    localUrl: string,
}

export interface IPrintOrderUnitResponse {
    comment: string,
    quantity: number,
    color: string,
    material: string,
    infill: number,
    file: File,
    estimatedPrice: number,
    attachmentFiles: IPrintOrderAttachmentFileResponse[],
    attachmentImages: IPrintOrderAttachmentImageResponse[],
}

interface IPrintOrderResponse {
    units: IPrintOrderUnitResponse[],
    comment: string,
    attachmentFiles: IPrintOrderAttachmentFileResponse[],
    attachmentImages: IPrintOrderAttachmentImageResponse[],
}

// interface IPrintOrderListResponse {
//     count: number,
//     next: string,
//     previous: string,
//     results: IPrintOrderUnitResponse[]
// }

export const usePrintOrderStore = defineStore('print-order', {
    state: () => ({
        units: [] as IPrintOrderUnitResponse[],
        attachmentFiles: [] as IPrintOrderAttachmentFileResponse[],
        attachmentImages: [] as IPrintOrderAttachmentImageResponse[],

        // count: undefined as number | undefined,
        // next: undefined as string | undefined,
        // previous: undefined as string | undefined,
        // printOrders: [] as IPrintOrderResponse[]
    }),

    getters: {
        getAttachmentFiles: (state) => state.attachmentFiles,
        getAttachmentImages: (state) => state.attachmentImages,
        getUnits: (state) => state.units,
    },

    actions: {
        // async fetchConstants() {
        //     return promiseWithTimeout(new Promise((resolve, reject) => {
        //         $fetch<IPrintOrderColor[]>('http://localhost:8000/api/print-orders/colors/', {
        //             method: 'GET',
        //         }).then((response: IPrintnOrderColor[]) {
        //             this.colors = response;
        //             resolve(response);
        //         }).catch((err) => {
        //             alert(err);
        //             reject(err);
        //         })
        //     }), 5000);
        // }

        
        // async createPrintOrder(email: string, firstName: string, lastName: string, address: string, phoneNumber: string, comment: string = '') {
        //     return new Promise((resolve, reject) => {
        //         $fetch<IPrintOrderUnitResponse>('http://localhost:8000/api/print-orders/', {
        //             method: 'POST',
        //             body: {
        //                 user_profile: {
        //                     email: email,
        //                     first_name: firstName,
        //                     last_name: lastName,
        //                     address: address,
        //                     phone_number: phoneNumber,
        //                 },
        //                 comment: comment,
        //             }
        //         }).then((response: IPrintOrderUnitResponse) => {
        //             this.createdPrintOrder = response;
        //             resolve(response)
        //         }).catch(err => {
        //             console.log(err);
        //             reject(err)
        //         });
        //     });
        // },

        addUnit(unit: IPrintOrderUnitResponse) {
            this.units.push(unit);
        },

        removeUnit(unit: IPrintOrderUnitResponse) {
            var index = this.units.reverse().indexOf(unit);

            if (index > -1)
            {
                this.units.splice(index, 1);
            } else
            {
                console.error("Item not found among order units");
            }
        },

        addAttachmentFile(attachmentFile: IPrintOrderAttachmentFileResponse) {
            this.attachmentFiles.push(attachmentFile);
        },

        removeAttachmentFile(attachmentFile: IPrintOrderAttachmentFileResponse) {
            var index = this.attachmentFiles.map((el) => el.file).indexOf(attachmentFile.file);

            if (index > -1)
            {
                this.attachmentFiles.splice(index, 1);
            } else
            {
                console.error("Item not found among attached files");
            }
        },

        addAttachmentImage(attachmentImage: IPrintOrderAttachmentImageResponse) {
            this.attachmentImages.push(attachmentImage);
        },

        removeAttachmentImage(attachmentImage: IPrintOrderAttachmentImageResponse) {
            var index = this.attachmentImages.map((el) => el.image).indexOf(attachmentImage.image);

            if (index > -1)
            {
                this.attachmentImages.splice(index, 1);
            } else
            {
                console.error("Item not found among attached images");
            }
        },


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

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderStore, import.meta.hot))
}
