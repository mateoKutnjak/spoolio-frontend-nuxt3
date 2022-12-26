import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_MODELING_ORDER } from '~~/constants/constants';

export interface IModelingOrderAttachmentFileResponse {
    file: File,
    comment: string,
    localUrl: string,
}

export interface IModelingOrderAttachmentImageResponse {
    image: File,
    comment: string,
    localUrl: string,
}

export interface IPrintOrderResponse {
    id: number,
    comment: string,
    attachmentFiles: IModelingOrderAttachmentFileResponse[],
    attachmentImages: IModelingOrderAttachmentImageResponse[],
    user_profile: number,
}

export const useModelingOrderStore = defineStore('modeling-order', {
    state: () => ({
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

        async postOrder(order: IPrintOrderResponse): Promise<IPrintOrderResponse> {

            return new Promise<IPrintOrderResponse>((resolve, reject) => {
                $fetch<IPrintOrderResponse>('http://localhost:8000/api/modeling-orders/orders/', {
                    method: 'POST',
                    body: order,
                }).then((response: IPrintOrderResponse) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            });
        },

        async postPrintOrderAttachmentFile(item: IModelingOrderAttachmentFileResponse, orderId: number) {
            var formData = new FormData();

            formData.append("file", item.file);
            formData.append("comment", item.comment);

            formData.append("content_type", CONTENT_TYPE_MODELING_ORDER)
            formData.append("object_id", orderId.toString());

            return new Promise((resolve, reject) => {
                $fetch<IModelingOrderAttachmentFileResponse>('http://localhost:8000/api/modeling-orders/attachment-files/', {
                    method: 'POST',
                    body: formData,
                }).then((response: IModelingOrderAttachmentFileResponse) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            });
        },

        addAttachmentFile(attachmentFile: IModelingOrderAttachmentFileResponse) {
            this.attachmentFiles.push(attachmentFile);
        },

        removeAttachmentFile(attachmentFile: IModelingOrderAttachmentFileResponse) {
            var index = this.attachmentFiles.map((el) => el.file).indexOf(attachmentFile.file);

            if (index > -1)
            {
                this.attachmentFiles.splice(index, 1);
            } else
            {
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

            if (index > -1)
            {
                this.attachmentImages.splice(index, 1);
            } else
            {
                console.error("Item not found among attached images");
            }
        },
    },
})

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(useModelingOrderStore, import.meta.hot))
}
