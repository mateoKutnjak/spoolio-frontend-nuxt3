import { acceptHMRUpdate, defineStore } from 'pinia'
import { CONTENT_TYPE_ORDER, CONTENT_TYPE_ORDER_UNIT, HTTP_REQUEST_TIMEOUT, LAYER_AREA, PRICE_MARGIN_FACTOR, PRINT_ORDER_FILES_SUFFIXES, PRINT_ORDER_FILES_TYPES, PRINT_ORDER_MIN_PRICE } from '~~/constants/constants';
import { IAddressBilling, IAddressShipping, IAttachmentFile, IAttachmentImage, IPrintOrder, IPrintOrderUnit } from '~~/constants/data';
import { useAuthStore } from './auth';
import { useFilamentInfillStore } from './filament_infill';
import { useFilamentSpoolStore } from './filament_spool';
import { useGlobalsStore } from './globals';
import { usePrintOrderHistoryStore } from './order_history_print';

async function postAttachmentFile(item: IAttachmentFile, contentType: string, objectId: number): Promise<IAttachmentFile> {

    const config = useRuntimeConfig();

    var formData = new FormData();
    formData.append("file", item.file);
    formData.append("comment", item.comment);
    formData.append("content_type", contentType)
    formData.append("object_id", objectId.toString());

    return new Promise((resolve, reject) => {
        customFetch<IAttachmentFile>('api/print-orders/attachment-files/', {
            baseURL: config.public.baseURL,
            method: 'POST',
            body: formData,
        }).then((response: IAttachmentFile) => {
            resolve(response)
        }).catch(err => {
            console.log(err);
            reject(err)
        });
    });
}

export const usePrintOrderStore = defineStore('print-order', {
    state: () => ({
        print_order: <IPrintOrder>{
            contact_email: '',
            shipping_address: <IAddressShipping>{},
            billing_address: <IAddressBilling>{},
            payment_method: '',
        },
        units: [] as IPrintOrderUnit[],
        attachmentFiles: [] as IAttachmentFile[],
        attachmentImages: [] as IAttachmentImage[],
    }),

    getters: {
        getAttachmentFiles: (state) => state.attachmentFiles,
        getAttachmentImages: (state) => state.attachmentImages,
        getUnits: (state) => state.units,
        getUnitByLocalUrl: (state) => {
            return (localUrl: string) => {
                return state.units.find(el => el.localUrl === localUrl);
            }
        },
        getContactEmail: (state) => state.print_order?.contact_email || '',
        getPriceByLocalUrl: (state) => {
            return (localUrl: string) => {
                const unit = state.units.find(el => el.localUrl === localUrl)

                if (!unit) {
                    throw createError(`Cannot calculate unit price. Unit with localUrl ${localUrl} not found`);
                }

                // * Model volume
                const v = unit.model_volume;

                // * Model bounding box volume
                let model_dimensions = vector3Parse(unit.model_dimensions)
                let vBbox = model_dimensions.x * model_dimensions.y * model_dimensions.z;

                // * Infill percentage
                const I = unit.infill.percentage;

                // * Density of material
                // ! Divide by 1000 because of conversion g/cm3 => g/mm3
                const D = unit.spool.material.density / 1000;

                // * Price of material per gram
                const G = unit.spool.material.price;

                // * Quantity
                const q = unit.quantity;


                if (!v || !q || !I || !D || !G || !vBbox) {
                    console.log("[SEE BELLOW] Some variables are not set and price for unit cannot be determined");
                    console.log("volume = " + v);
                    console.log("bbox volume = " + vBbox);
                    console.log("quantity = " + q);
                    console.log("infill = " + I);
                    console.log("density = " + D);
                    console.log("price = " + G);
                    return Number.NEGATIVE_INFINITY;
                }

                const vAvg = (v + vBbox) / 2;

                return vAvg * D * G * q * I * PRICE_MARGIN_FACTOR;
            }
        },
        getTotalPrice: (state) => {
            return Math.max(state.units.reduce((acc, item) => {
                const v = item.model_volume;

                let model_dimensions = vector3Parse(item.model_dimensions)
                let vBbox = model_dimensions.x * model_dimensions.y * model_dimensions.z;

                const q = item.quantity;
                const i = item.infill.percentage;

                // ! Divide by 1000 because of conversion g/cm3 => g/mm3
                const d = item.spool.material.density / 1000;
                const p = item.spool.material.price;

                if (!v || !q || !i || !d || !p || !vBbox) {
                    return Number.NEGATIVE_INFINITY;
                }

                const vAvg = (v + vBbox) / 2;

                return vAvg * d * p * q * i * PRICE_MARGIN_FACTOR + acc;
            }, 0), PRINT_ORDER_MIN_PRICE);
        },
        getETASecondsByLocalUrl: (state) => {
            return (localUrl: string) => {

                const item = state.units.find(el => el.localUrl === localUrl)

                if (!item) {
                    throw createError(`Cannot calculate unit price. Unit with localUrl ${localUrl} not found`);
                }

                const objVolume = item.model_volume;

                let model_dimensions = vector3Parse(item.model_dimensions)
                let vBbox = model_dimensions.x * model_dimensions.y * model_dimensions.z;

                const q = item.quantity;
                const i = item.infill.percentage;
                const vPrint = item.spool.material.printing_speed;

                if (!objVolume || !q || !i || !vPrint || !vBbox) {
                    console.log("[SEE BELLOW] [localUrl=" + item.localUrl + "] Some variables are not set and price for unit cannot be determined");
                    console.log("volume = " + objVolume);
                    console.log('bounding box volume = ' + vBbox);
                    console.log("quantity = " + q);
                    console.log("infill = " + i);
                    console.log("printing speed = " + vPrint);
                    // console.log("price = " + p);
                    return Number.NEGATIVE_INFINITY;
                }

                const vAvg = (objVolume + vBbox) / 2;
                const V = i * vAvg;
                const vVolume = vPrint * LAYER_AREA;
                const t = V / vVolume;

                return q * t;
            }
        },
        getETASeconds: (state) => {
            return state.units.reduce((acc, item) => {

                const objVolume = item.model_volume;

                let model_dimensions = vector3Parse(item.model_dimensions)
                let vBbox = model_dimensions.x * model_dimensions.y * model_dimensions.z;

                const q = item.quantity;
                const i = item.infill.percentage;
                const vPrint = item.spool.material.printing_speed;

                if (!objVolume || !q || !i || !vPrint || !vBbox) {
                    console.log("[SEE BELLOW] [localUrl=" + item.localUrl + "] Some variables are not set and price for unit cannot be determined");
                    console.log("volume = " + objVolume);
                    console.log('bounding box volume = ' + vBbox);
                    console.log("quantity = " + q);
                    console.log("infill = " + i);
                    console.log("printing speed = " + vPrint);
                    // console.log("price = " + p);
                    return Number.NEGATIVE_INFINITY;
                }

                const vAvg = (objVolume + vBbox) / 2;
                const V = i * vAvg;
                const vVolume = vPrint * LAYER_AREA;
                const t = V / vVolume;

                return q * t + acc;
            }, 0);
        },
    },

    actions: {

        clear() {
            this.units.splice(0, this.units.length);
            this.attachmentFiles.splice(0, this.attachmentFiles.length);
            this.attachmentImages.splice(0, this.attachmentImages.length);
        },

        async postOrder(): Promise<IPrintOrder> {

            const config = useRuntimeConfig();
            const authStore = useAuthStore();

            const body = {
                contact_email: this.print_order?.contact_email || '',
                shipping_address: this.print_order?.shipping_address || '',
                billing_address: this.print_order?.billing_address || '',
                shipping_method: this.print_order?.shipping_method.id || '',
                payment_method: this.print_order?.payment_method || '',
                user_profile: authStore.getUser?.profile?.id,
                estimated_price: this.getTotalPrice.toFixed(2),
                estimated_time: Math.round(this.getETASeconds).toString()
            }

            return promiseWithTimeout<IPrintOrder>(new Promise<IPrintOrder>((resolve, reject) => {
                customFetch<IPrintOrder>('api/print-orders/orders/', {
                    baseURL: config.public.baseURL,
                    method: 'POST',
                    body: body,
                }).then((response: IPrintOrder) => {
                    const printOrderHistoryStore = usePrintOrderHistoryStore();

                    this.print_order = response;
                    printOrderHistoryStore.add(response);

                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            }), HTTP_REQUEST_TIMEOUT);
        },

        async postOrderUnit(unit: IPrintOrderUnit, orderId: number): Promise<IPrintOrderUnit> {

            const config = useRuntimeConfig();

            var formData = new FormData();
            formData.append("comment", unit.comment);
            formData.append("spool", unit.spool.id.toString());
            formData.append("infill", unit.infill.id.toString());
            formData.append("file", unit.file);
            formData.append('quantity', unit.quantity.toString());
            formData.append('length_unit', unit.length_unit)
            formData.append('rotation_unit', unit.rotation_unit)
            formData.append("estimated_price", this.getPriceByLocalUrl(unit.localUrl).toFixed(2));
            formData.append('estimated_time', Math.round(this.getETASecondsByLocalUrl(unit.localUrl)).toString())
            formData.append('model_volume', unit.model_volume.toString());
            formData.append('model_dimensions', unit.model_dimensions)
            formData.append('model_rotation', unit.model_rotation)
            formData.append('optimal_rotation', unit.optimal_rotation);
            formData.append('use_optimal_rotation', unit.use_optimal_rotation.toString())

            // todo what to do with this
            formData.append("order", orderId.toString());

            return promiseWithTimeout<IPrintOrderUnit>(new Promise((resolve, reject) => {
                customFetch<IPrintOrderUnit>('api/print-orders/units/', {
                    baseURL: config.public.baseURL,
                    method: 'POST',
                    body: formData,
                }).then((response: IPrintOrderUnit) => {
                    resolve(response)
                }).catch(err => {
                    console.log(err);
                    reject(err)
                });
            }), HTTP_REQUEST_TIMEOUT);
        },

        async postPrintOrderAttachmentFile(item: IAttachmentFile, orderId: number): Promise<IAttachmentFile> {
            return postAttachmentFile(item, CONTENT_TYPE_ORDER, orderId);
        },

        async postPrintOrderUnitAttachmentFile(item: IAttachmentFile, orderUnitId: number) {
            return postAttachmentFile(item, CONTENT_TYPE_ORDER_UNIT, orderUnitId);
        },

        addUnit(unit: IPrintOrderUnit) {
            this.units.push(unit);
        },

        async add3dModelFile(file: File) {
            if (PRINT_ORDER_FILES_TYPES.indexOf(file.type) < 0 && PRINT_ORDER_FILES_SUFFIXES.indexOf(urlExtractFileSuffix(file.name.toLowerCase())) < 0) {
                console.error(`Cannot add file type ${file.type} as 3d model. Supported models are ${PRINT_ORDER_FILES_TYPES}`);
                return;
            }

            const filamentSpoolStore = useFilamentSpoolStore();
            const filamentInfillStore = useFilamentInfillStore();
            const globalsStore = useGlobalsStore();

            if (!filamentSpoolStore.getAll.length) {
                console.error(`Cannot add file as 3d model. No default filament color found`);
                return;
            }

            if (!filamentInfillStore.getFilamentInfills.length) {
                console.error(`Cannot add file as 3d model. No default filament infill found`);
                return;
            }

            const localUrl = URL.createObjectURL(file);
            const { model_volume, model_dimensions, optimal_rotation, model_rotation } = await preprocess3dObject(localUrl);

            create3dObjectScreenshot(localUrl, filamentSpoolStore.getAll[0].color.value, 400, 400, blob => {
                this.units.push(<IPrintOrderUnit>{
                    id: undefined,
                    quantity: 1,
                    spool: filamentSpoolStore.getAll[0],
                    infill: filamentInfillStore.getFilamentInfills[0],
                    estimated_price: 0,
                    estimated_time: 0,
                    file: file,
                    comment: "TODO",
                    localUrl: localUrl,
                    attachmentFiles: [],
                    attachmentImages: [],
                    order: undefined,
                    model_dimensions: vector3ToString(model_dimensions),
                    model_volume: model_volume,
                    model_rotation: vector3ToString(model_rotation),
                    model_rotation_display: vector3ToString(model_rotation),
                    optimal_rotation: vector3ToString(optimal_rotation),
                    use_optimal_rotation: true,
                    length_unit: DimensionUnit[globalsStore.getDimensionUnit],
                    rotation_unit: RotationUnit[globalsStore.getRotationUnit],
                    screenshotURL: URL.createObjectURL(blob),
                });
            })
        },

        updateScreenshot(localUrl: string) {
            const unit = this.getUnitByLocalUrl(localUrl);

            if (!unit) {
                console.log(`Cannot update screenshot. Unit with local URL ${localUrl} does not exist`);
                return;
            }

            create3dObjectScreenshot(localUrl, unit.spool.color.value, 400, 400, blob => {
                this.updateUnit(localUrl, { screenshotURL: URL.createObjectURL(blob) });
            })
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

        removeUnit(unit: IPrintOrderUnit) {
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
    import.meta.hot.accept(acceptHMRUpdate(usePrintOrderStore, import.meta.hot))
}
