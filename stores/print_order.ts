import { acceptHMRUpdate, defineStore } from 'pinia'
import { Vector3 } from 'three';
import { CONTENT_TYPE_ORDER, CONTENT_TYPE_ORDER_UNIT } from '~~/constants/constants';
import { IAddressResponse, useAuthStore } from './auth';
import { useFilamentInfillStore } from './filament_infill';
import { useFilamentMaterialStore } from './filament_material';
import { useGlobalsStore } from './globals';
import { IShippingMethod } from './shipping_method';

export interface IPrintOrderAttachmentFileResponse {
    id: number,
    file: File,
    comment: string,
    localUrl: string,
}

export interface IPrintOrderAttachmentImageResponse {
    id: number,
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
    modelVolume: number,
    lengthUnit: string
}

export interface IPrintOrderResponse {
    id: number,
    created_at: string,
    updated_at: string,
    units: IPrintOrderUnitResponse[],
    unit_count: number,
    comment: string,
    attachmentFiles: IPrintOrderAttachmentFileResponse[],
    attachmentImages: IPrintOrderAttachmentImageResponse[],
    user_profile: number,
    contact_email: string,
    shipping_address: IAddressResponse,
    billing_address: IAddressResponse,
    estimated_price: number,
    status: string,
}

export function printOrderStatusReformat(status: string): string {
    var result = status.replace("_", " ");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function printOrderStatusBackgroundColor(status: string): string {
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

async function postAttachmentFile(item: IPrintOrderAttachmentFileResponse, contentType: string, objectId: number): Promise<IPrintOrderAttachmentFileResponse> {

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
        paymentMethod: "",
        contactEmail: "",
        shippingAddress: <IAddressResponse>{},
        billingAddress: <IAddressResponse>{},
        shippingMethod: <IShippingMethod>{},
        units: [] as IPrintOrderUnitResponse[],
        attachmentFiles: [] as IPrintOrderAttachmentFileResponse[],
        attachmentImages: [] as IPrintOrderAttachmentImageResponse[],
    }),

    getters: {
        getAttachmentFiles: (state) => state.attachmentFiles,
        getAttachmentImages: (state) => state.attachmentImages,
        getUnits: (state) => state.units,
        getContactEmail: (state) => state.contactEmail,
        getPriceByLocalUrl: (state) => {
            return (localUrl: string) => {
                const filamentMaterialStore = useFilamentMaterialStore()
                const filamentInfillStore = useFilamentInfillStore()

                const unit = state.units.find(el => el.localUrl === localUrl)

                const v = unit?.modelVolume;
                const q = unit?.quantity;
                const i = unit?.infill ? filamentInfillStore.getPercentageById(unit.infill) : undefined;
                const d = unit?.material ? filamentMaterialStore.getDensityById(unit.material) : undefined;
                const p = unit?.material ? filamentMaterialStore.getPriceById(unit.material) : undefined;

                if (!v || !q || !i || !d || !p) {
                    console.log("[SEE BELLOW] Some variables are not set and price for unit cannot be determined");
                    console.log("volume = " + v);
                    console.log("quantity = " + q);
                    console.log("infill = " + i);
                    console.log("density = " + d);
                    console.log("price = " + p);
                    return Number.NEGATIVE_INFINITY;
                }

                return (v / 1000) * d * p * q * i;
            }
        },
        getTotalPrice: (state) => {
            return state.units.reduce((acc, item) => {
                const filamentMaterialStore = useFilamentMaterialStore()
                const filamentInfillStore = useFilamentInfillStore()

                const v = item.modelVolume;
                const q = item.quantity;
                const i = item.infill ? filamentInfillStore.getPercentageById(item.infill) : undefined;
                const d = item.material ? filamentMaterialStore.getDensityById(item.material) : undefined;
                const p = item.material ? filamentMaterialStore.getPriceById(item.material) : undefined;

                if (!v || !q || !i || !d || !p) {
                    console.log("[SEE BELLOW] [localUrl=" + item.localUrl + "] Some variables are not set and price for unit cannot be determined");
                    console.log("volume = " + v);
                    console.log("quantity = " + q);
                    console.log("infill = " + i);
                    console.log("density = " + d);
                    console.log("price = " + p);
                    return Number.NEGATIVE_INFINITY;
                }

                return (v / 1000 * d) * p * q * i + acc;
            }, 0);
        }
    },

    actions: {

        async postOrder(): Promise<IPrintOrderResponse> {

            const authStore = useAuthStore();

            const body = {
                contact_email: this.contactEmail,
                shipping_address: this.shippingAddress,
                billing_address: this.billingAddress,
                shipping_method: this.shippingMethod.id,
                payment_method: this.paymentMethod,
                user_profile: authStore.getUser?.profile?.id,
                estimated_price: 999. // TODO
            }

            return new Promise<IPrintOrderResponse>((resolve, reject) => {
                $fetch<IPrintOrderResponse>('http://localhost:8000/api/print-orders/orders/', {
                    method: 'POST',
                    body: body,
                }).then((response: IPrintOrderResponse) => {
                    // this.createdPrintOrder = response;
                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            });
        },

        async postOrderUnit(unit: IPrintOrderUnitResponse, orderId: number): Promise<IPrintOrderUnitResponse> {

            const globalsStore = useGlobalsStore();

            var formData = new FormData();
            formData.append("comment", unit.comment);
            formData.append("color", unit.color.toString());
            formData.append("material", unit.material.toString());
            formData.append("infill", unit.infill.toString());
            formData.append("file", unit.file);
            formData.append('quantity', unit.quantity.toString());
            formData.append('length_unit', DimensionUnit[globalsStore.getDimensionUnit])
            formData.append("estimatedPrice", unit.estimatedPrice.toString());

            // todo what to do with this
            formData.append("order", orderId.toString());

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

        async postPrintOrderAttachmentFile(item: IPrintOrderAttachmentFileResponse, orderId: number): Promise<IPrintOrderAttachmentFileResponse> {
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

            if (index != -1) {
                const unit = this.units[index];

                const updatedUnit = Object.assign(unit, fieldUpdate)

                this.units[index] = updatedUnit;
            }
        },

        removeUnit(unit: IPrintOrderUnitResponse) {
            var index = this.units.findIndex(el => el.localUrl === unit.localUrl);

            if (index > -1) {
                this.units = this.units.splice(index, 1);
            } else {
                console.error("Item not found among order units");
            }
        },

        removeUnitByFileLocalUrl(fileLocalUrl: string) {
            var index = this.units.findIndex(el => el.localUrl === fileLocalUrl);

            if (index > -1) {
                this.units.splice(index, 1);
            } else {
                console.error("Item not found among order units");
            }
        },

        addAttachmentFile(attachmentFile: IPrintOrderAttachmentFileResponse) {
            this.attachmentFiles.push(attachmentFile);
        },

        removeAttachmentFile(attachmentFile: IPrintOrderAttachmentFileResponse) {
            var index = this.attachmentFiles.map((el) => el.file).indexOf(attachmentFile.file);

            if (index > -1) {
                this.attachmentFiles.splice(index, 1);
            } else {
                console.error("Item not found among attached files");
            }
        },

        addAttachmentImage(attachmentImage: IPrintOrderAttachmentImageResponse) {
            this.attachmentImages.push(attachmentImage);
        },

        removeAttachmentImage(attachmentImage: IPrintOrderAttachmentImageResponse) {
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
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderStore, import.meta.hot))
}
