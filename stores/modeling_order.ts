import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_MODELING_ORDER, HTTP_REQUEST_TIMEOUT } from '~~/constants/constants';
import { IAttachmentFile, IAttachmentImage, IModelingOrder, IModelingOrderItemAttribute, IModelingOrderItemType, IModelingOrderOrderType } from '~~/constants/data';
import { useAuthStore } from './auth';
import { ofetch } from 'ofetch';

export const useModelingOrderStore = defineStore('modeling-order', {
    state: () => ({
        modeling_order: <IModelingOrder>{
            contact_email: '',
            comment: '',
            item_type: null as IModelingOrderItemType | null,
            item_attributes: [] as IModelingOrderItemAttribute[],
            order_type: null as IModelingOrderOrderType | null,
        },

        attachmentFiles: [] as IAttachmentFile[],
        attachmentImages: [] as IAttachmentImage[],

        itemTypes: [] as IModelingOrderItemType[],
        itemAttributes: [] as IModelingOrderItemAttribute[],

        orderTypes: [] as IModelingOrderOrderType[],
    }),

    getters: {
        getAttachmentFiles: (state) => state.attachmentFiles,
        getAttachmentImages: (state) => state.attachmentImages,
        getContactEmail: (state) => state.modeling_order.contact_email,
        getItemTypes: (state) => state.itemTypes,
        getItemAttributes: (state) => state.itemAttributes,
        getOrderTypes: (state) => state.orderTypes,
    },

    actions: {

        clear() {
            this.modeling_order = <IModelingOrder>{
                contact_email: '',
                comment: '',
                item_type: null as IModelingOrderItemType | null,
                item_attributes: [] as IModelingOrderItemAttribute[],
                order_type: null as IModelingOrderOrderType | null,
            }
        },

        async postOrder(): Promise<IModelingOrder> {

            const config = useRuntimeConfig();

            const authStore = useAuthStore();

            const body = {
                contact_email: this.modeling_order.contact_email,
                comment: this.modeling_order.comment,
                user_profile: authStore.getUser?.profile?.id,
                item_attributes: this.modeling_order.item_attributes.map(el => el.id),
                item_type: this.modeling_order.item_type?.id || null,
                order_type: this.modeling_order.order_type?.id || null,
            }

            return promiseWithTimeout<IModelingOrder>(new Promise<IModelingOrder>((resolve, reject) => {
                customFetch<IModelingOrder>('api/modeling-orders/orders/', {
                    baseURL: config.public.baseURL,
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

            const config = useRuntimeConfig();

            var formData = new FormData();
            formData.append("file", item.file);
            formData.append("content_type", CONTENT_TYPE_MODELING_ORDER)
            formData.append("object_id", orderId.toString());

            return promiseWithTimeout<IAttachmentFile>(new Promise((resolve, reject) => {
                customFetch<IAttachmentFile>('api/attachment-files/', {
                    baseURL: config.public.baseURL,
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

            const config = useRuntimeConfig();


            var formData = new FormData();
            formData.append("image", item.image);
            formData.append("content_type", CONTENT_TYPE_MODELING_ORDER)
            formData.append("object_id", orderId.toString());

            return promiseWithTimeout<IAttachmentImage>(new Promise((resolve, reject) => {
                customFetch<IAttachmentImage>('api/attachment-images/', {
                    baseURL: config.public.baseURL,
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

        async fetchItemTypes(): Promise<IModelingOrderItemType[]> {
            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IModelingOrderItemType[]>('api/modeling-orders/item-types/', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IModelingOrderItemType[]) => {
                    this.itemTypes = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchItemAttributes() {
            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IModelingOrderItemAttribute[]>('api/modeling-orders/item-attributes/', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IModelingOrderItemAttribute[]) => {
                    this.itemAttributes = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        async fetchOrderTypes() {
            const config = useRuntimeConfig();

            return promiseWithTimeout(new Promise((resolve, reject) => {
                ofetch<IModelingOrderOrderType[]>('api/modeling-orders/order-types/', {
                    baseURL: config.public.baseURL,
                    method: 'GET',
                }).then((response: IModelingOrderOrderType[]) => {
                    this.orderTypes = response;
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                })
            }), HTTP_REQUEST_TIMEOUT);
        },

        updateOrder(fieldUpdate: any) {

            if (!this.modeling_order) return;
            Object.assign(this.modeling_order, fieldUpdate)
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useModelingOrderStore, import.meta.hot))
}
