import { acceptHMRUpdate, defineStore } from 'pinia'
import { Vector3 } from 'three';
import { CONTENT_TYPE_ORDER, CONTENT_TYPE_ORDER_UNIT } from '~~/constants/constants';

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
    id: number | undefined,
    comment: string,
    quantity: number,
    color: number, // color id
    material: number, // material id
    infill: number,
    file: File,
    localUrl: string,
    estimatedPrice: number,
    attachmentFiles: IPrintOrderAttachmentFileResponse[],
    attachmentImages: IPrintOrderAttachmentImageResponse[],
    order: number | undefined,
    modelDimensions: Vector3 | undefined,
    lengthUnit: string
}

export interface IPrintOrderResponse {
    id: number,
    units: IPrintOrderUnitResponse[],
    comment: string,
    attachmentFiles: IPrintOrderAttachmentFileResponse[],
    attachmentImages: IPrintOrderAttachmentImageResponse[],
    user_profile: number,
}

async function postAttachmentFile(item: IPrintOrderAttachmentFileResponse, contentType: string, objectId: number) {

    var formData = new FormData();

    formData.append("file", item.file);
    formData.append("comment", item.comment);

    formData.append("content_type", contentType)
    formData.append("object_id", objectId.toString());

    return new Promise((resolve, reject) => {
        $fetch<IPrintOrderAttachmentFileResponse>('http://localhost:8000/api/print-orders/attachment-files/', {
            method: 'POST',
            body: formData,
        }).then((response: IPrintOrderAttachmentFileResponse) => {
            // this.createdPrintOrder = response;
            resolve(response)
        }).catch(err => {
            console.log(err);
            reject(err)
        });
    });
}

export const usePrintOrderStore = defineStore('print-order', {
    state: () => ({
        units: [] as IPrintOrderUnitResponse[],
        attachmentFiles: [] as IPrintOrderAttachmentFileResponse[],
        attachmentImages: [] as IPrintOrderAttachmentImageResponse[],
    }),

    getters: {
        getAttachmentFiles: (state) => state.attachmentFiles,
        getAttachmentImages: (state) => state.attachmentImages,
        getUnits: (state) => state.units,
    },

    actions: {

        async postOrder(order: IPrintOrderResponse): Promise<IPrintOrderResponse> {

            return new Promise<IPrintOrderResponse>((resolve, reject) => {
                $fetch<IPrintOrderResponse>('http://localhost:8000/api/print-orders/orders/', {
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

        async postOrderUnit(unit: IPrintOrderUnitResponse): Promise<IPrintOrderUnitResponse> {

            var formData = new FormData();
            formData.append("comment", unit.comment);
            formData.append("color", unit.color.toString());
            formData.append("material", unit.material.toString());
            formData.append("infill", unit.infill.toString());
            formData.append("file", unit.file);
            formData.append('quantity', unit.quantity.toString());
            formData.append("estimatedPrice", unit.estimatedPrice.toString());

            // todo what to do with this
            formData.append("order", unit.order?.toString() || '-1');

            return new Promise((resolve, reject) => {
                $fetch<IPrintOrderUnitResponse>('http://localhost:8000/api/print-orders/units/', {
                    method: 'POST',
                    body: formData,
                }).then((response: IPrintOrderUnitResponse) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            });
        },

        async postPrintOrderAttachmentFile(item: IPrintOrderAttachmentFileResponse, orderId: number) {
            return postAttachmentFile(item, CONTENT_TYPE_ORDER, orderId);
        },

        async postPrintOrderUnitAttachmentFile(item: IPrintOrderAttachmentFileResponse, orderUnitId: number) {
            return postAttachmentFile(item, CONTENT_TYPE_ORDER_UNIT, orderUnitId);
        },

        addUnit(unit: IPrintOrderUnitResponse) {
            this.units.push(unit);
        },

        updateUnit(localUrl: string, fieldUpdate: any) {

            //todo check if field exist in unit 
            // todo check if value is of good type

            const index = this.units.findIndex(el => el.localUrl === localUrl);

            if (index != -1)
            {
                const unit = this.units[index];

                const updatedUnit = Object.assign(unit, fieldUpdate)

                this.units[index] = updatedUnit;
            }
        },

        removeUnit(unit: IPrintOrderUnitResponse) {
            var index = this.units.findIndex(el => el.localUrl === unit.localUrl);

            if (index > -1)
            {
                this.units = this.units.splice(index, 1);
            } else
            {
                console.error("Item not found among order units");
            }
        },

        removeUnitByFileLocalUrl(fileLocalUrl: string) {
            var index = this.units.findIndex(el => el.localUrl === fileLocalUrl);

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
    },
})

if (import.meta.hot)
{
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderStore, import.meta.hot))
}
