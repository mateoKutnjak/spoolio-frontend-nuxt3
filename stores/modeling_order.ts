import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_MODELING_ORDER, HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IProfileResponse, useAuthStore } from './auth';

export interface IModelingOrderAttachmentFileResponse {
    id: number,
    file: File,
    comment: string,
    localUrl: string,
}

export interface IModelingOrderAttachmentImageResponse {
    id: number,
    image: File,
    comment: string,
    localUrl: string,
}

export interface IModelingOrderResponse {
    id: number,
    created_at: string,
    updated_at: string,
    comment: string,
    attachmentFiles: IModelingOrderAttachmentFileResponse[],
    attachmentImages: IModelingOrderAttachmentImageResponse[],
    contact_email: string,
    estimated_price: number,
    status: string,
}

export function modelingStatusReformat(status: string): string {
    var result = status.replace("_", " ");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function modelingStatusBackgroundColor(status: string): string {
    switch (status) {
        case "reviewing":
            return "#cbd5e1";
        case "estimating_price":
            return '#d1d5db'
        case "rejected":
            return "#fca5a5";
        case "awaiting_payment":
            return "#fcd34d";
        case "in_progress":
            return "#38bdf8";
        case "shipped":
            return "#14b8a6";
        case "delivered":
            return "#84cc16";
        default:
            return "green";
    }
}

export const useModelingOrderStore = defineStore('modeling-order', {
    state: () => ({
        comment: "",
        contactEmail: "",
        attachmentFiles: [] as IModelingOrderAttachmentFileResponse[],
        attachmentImages: [] as IModelingOrderAttachmentImageResponse[],
    }),

    getters: {
        getAttachmentFiles: (state) => state.attachmentFiles,
        getAttachmentImages: (state) => state.attachmentImages,
        getContactEmail: (state) => state.contactEmail,
    },

    actions: {

        async postOrder(): Promise<IModelingOrderResponse> {
            const authStore = useAuthStore();

            const body = {
                contact_email: this.contactEmail,
                comment: this.comment,
                user_profile: authStore.getUser?.profile?.id
            }

            return promiseWithTimeout<IModelingOrderResponse>(new Promise<IModelingOrderResponse>((resolve, reject) => {
                customFetch<IModelingOrderResponse>('http://localhost:8000/api/modeling-orders/', {
                    method: 'POST',
                    body: body,
                }).then((response: IModelingOrderResponse) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                });
            }), HTTP_REQUEST_TIMEOUT);
        },

        async postAttachmentFile(item: IModelingOrderAttachmentFileResponse, orderId: number): Promise<IModelingOrderAttachmentFileResponse> {
            var formData = new FormData();

            formData.append("file", item.file);

            formData.append("content_type", CONTENT_TYPE_MODELING_ORDER)
            formData.append("object_id", orderId.toString());

            return new Promise((resolve, reject) => {
                customFetch<IModelingOrderAttachmentFileResponse>('http://localhost:8000/api/attachment-files/', {
                    method: 'POST',
                    body: formData,
                }).then((response: IModelingOrderAttachmentFileResponse) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                });
            });
        },

        async postAttachmentImage(item: IModelingOrderAttachmentImageResponse, orderId: number): Promise<IModelingOrderAttachmentImageResponse> {
            var formData = new FormData();

            formData.append("image", item.image);

            formData.append("content_type", CONTENT_TYPE_MODELING_ORDER)
            formData.append("object_id", orderId.toString());

            return new Promise((resolve, reject) => {
                customFetch<IModelingOrderAttachmentImageResponse>('http://localhost:8000/api/attachment-images/', {
                    method: 'POST',
                    body: formData,
                }).then((response: IModelingOrderAttachmentImageResponse) => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                });
            });
        },

        addAttachmentFile(attachmentFile: IModelingOrderAttachmentFileResponse) {
            this.attachmentFiles.push(attachmentFile);
        },

        removeAttachmentFile(attachmentFile: IModelingOrderAttachmentFileResponse) {
            var index = this.attachmentFiles.map((el) => el.file).indexOf(attachmentFile.file);

            if (index > -1) {
                this.attachmentFiles.splice(index, 1);
            } else {
                console.error("Item not found among attached files");
            }
        },

        removeAttachmentFileByLocalUrl(localUrl: string) {
            this.attachmentFiles = this.attachmentFiles.filter(el => el.localUrl !== localUrl);
        },

        addAttachmentImage(attachmentImage: IModelingOrderAttachmentImageResponse) {
            this.attachmentImages.push(attachmentImage);
        },

        removeAttachmentImage(attachmentImage: IModelingOrderAttachmentImageResponse) {
            var index = this.attachmentImages.map((el) => el.image).indexOf(attachmentImage.image);

            if (index > -1) {
                this.attachmentImages.splice(index, 1);
            } else {
                console.error("Item not found among attached images");
            }
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useModelingOrderStore, import.meta.hot))
}
