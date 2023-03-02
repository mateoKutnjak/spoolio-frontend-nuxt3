import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_MODELING_ORDER, HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IAttachmentFile, IAttachmentImage, IModelingOrder } from '~~/constants/data';
import { useAuthStore } from './auth';

export const useModelingOrderStore = defineStore('modeling-order', {
    state: () => ({
        modeling_order: <IModelingOrder>{
            contact_email: '',
            comment: '',
        },
        
        attachmentFiles: [] as IAttachmentFile[],
        attachmentImages: [] as IAttachmentImage[],
    }),

    getters: {
        getAttachmentFiles: (state) => state.attachmentFiles,
        getAttachmentImages: (state) => state.attachmentImages,
        getContactEmail: (state) => state.modeling_order.contact_email,
    },

    actions: {

        clear() {
            this.modeling_order = <IModelingOrder>{
                contact_email: '',
                comment: '',
            }
        },

        async postOrder(): Promise<IModelingOrder> {
            const authStore = useAuthStore();

            const body = {
                contact_email: this.modeling_order.contact_email,
                comment: this.modeling_order.comment,
                user_profile: authStore.getUser?.profile?.id
            }

            return promiseWithTimeout<IModelingOrder>(new Promise<IModelingOrder>((resolve, reject) => {
                customFetch<IModelingOrder>('http://localhost:8000/api/modeling-orders/', {
                    method: 'POST',
                    body: body,
                }).then((response: IModelingOrder) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                });
            }), HTTP_REQUEST_TIMEOUT);
        },

        async postAttachmentFile(item: IAttachmentFile, orderId: number): Promise<IAttachmentFile> {
            var formData = new FormData();

            formData.append("file", item.file);

            formData.append("content_type", CONTENT_TYPE_MODELING_ORDER)
            formData.append("object_id", orderId.toString());

            return promiseWithTimeout<IAttachmentFile>(new Promise((resolve, reject) => {
                customFetch<IAttachmentFile>('http://localhost:8000/api/attachment-files/', {
                    method: 'POST',
                    body: formData,
                }).then((response: IAttachmentFile) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    reject(err)
                });
            }), HTTP_REQUEST_TIMEOUT);
        },

        async postAttachmentImage(item: IAttachmentImage, orderId: number): Promise<IAttachmentImage> {
            var formData = new FormData();

            formData.append("image", item.image);

            formData.append("content_type", CONTENT_TYPE_MODELING_ORDER)
            formData.append("object_id", orderId.toString());

            return promiseWithTimeout<IAttachmentImage>(new Promise((resolve, reject) => {
                customFetch<IAttachmentImage>('http://localhost:8000/api/attachment-images/', {
                    method: 'POST',
                    body: formData,
                }).then((response: IAttachmentImage) => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                });
            }), HTTP_REQUEST_TIMEOUT);
        },

        addAttachmentFile(attachmentFile: IAttachmentFile) {
            this.attachmentFiles.push(attachmentFile);
        },

        removeAttachmentFile(attachmentFile: IAttachmentFile) {
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

        addAttachmentImage(attachmentImage: IAttachmentImage) {
            this.attachmentImages.push(attachmentImage);
        },

        removeAttachmentImage(attachmentImage: IAttachmentImage) {
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
