import { acceptHMRUpdate, defineStore } from 'pinia'
import { BILLING_ADDRESS_TYPE_INDIVIDUAL, CONTENT_TYPE_ORDER, CONTENT_TYPE_ORDER_UNIT, HOURLY_RATE_EUR, HTTP_3D_MODEL_POST_REQUEST_TIMEOUT, HTTP_REQUEST_TIMEOUT, LAYER_AREA, PRICE_MARGIN_FACTOR, PRINT_ORDER_FILES_SUFFIXES, PRINT_ORDER_FILES_TYPES, PRINT_ORDER_MIN_PRICE, PRINT_ORDER_UNIT_FIELDS_JOB_ETA_ESTIMATION, PRINT_ORDER_UNIT_FIELDS_SLICER_ESTIMATION, PROFIT_MARGIN_MULTIPLIER, TIMEOUT_WS_PRINT_JOB_ETA_ESTIMATION_DATA_MESSAGE, TIMEOUT_WS_SLICER_ESTIMATION_DATA_MESSAGE, TIMEOUT_WS_SLICER_ESTIMATION_INIT_MESSAGE } from '~~/constants/constants';
import { IAddressBilling, IAddressShipping, IAttachmentFile, IAttachmentImage, IPrintOrder, IPrintOrderUnit, IPrintingMethod } from '~~/constants/data';
import { useAuthStore } from './auth';
import { useFilamentSpoolStore } from './filament_spool';
import { useGlobalsStore } from './globals';
import { usePrintOrderHistoryStore } from './order_history_print';
import { useNotificationStore } from './notification';
import { usePrintOrderUnitWallStore } from './print_order_unit_wall';
import { usePrintOrderUnitInfillWallCombinationStore } from './print_order_unit_infill_wall_combination';
import { usePrintingMethodStore } from './printing_method';
import { useDialogStore } from './dialog';

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

export function adjustPrice(item: IPrintOrderUnit) {
    if (!item.estimated_price) {
        console.error(`Cannot calculate adjusted price. Estimated price is not defined for localUrl=${item.localUrl}`);
        return Number.POSITIVE_INFINITY;
    }

    if (!item.estimated_time) {
        console.error(`Cannot calculate adjusted price. Estimated time is not defined for localUrl=${item.localUrl}`);
        return Number.POSITIVE_INFINITY;
    }

    const estimated_time_hours = item.estimated_time / 60 / 60;

    return (Number(item.estimated_price) + estimated_time_hours * HOURLY_RATE_EUR) * PROFIT_MARGIN_MULTIPLIER
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
                return state.units.find(el => el.localUrl.includes(localUrl));
            }
        },
        getContactEmail: (state) => state.print_order?.contact_email || '',
        getPriceByLocalUrl: (state) => {
            return (localUrl: string) => {
                const item = state.units.find(el => el.localUrl === localUrl)

                if (!item) {
                    throw createError(`Cannot calculate unit price. Unit with localUrl ${localUrl} not found`);
                }
                return item.quantity * adjustPrice(item);
            }
        },
        getTotalPrice: (state) => {
            const priceSum = state.units.reduce((acc, item) => {
                if (!item.estimated_price) {
                    return Number.NEGATIVE_INFINITY;
                }

                const adjustedPrice = adjustPrice(item);
                return acc + item.quantity * adjustedPrice;
            }, 0);

            if (priceSum !== Number.NEGATIVE_INFINITY) {
                return Math.max(priceSum, PRINT_ORDER_MIN_PRICE)
            }
            return priceSum;
        },
        getETASeconds: (state) => {

            return state.units.reduce((acc, item) => {
                if (!item.estimated_time) {
                    return Number.NEGATIVE_INFINITY;
                }
                return acc + item.quantity * item.estimated_time;
            }, 0)
        },
        getETA: (state) => {
            return state.print_order.eta;
        }
    },

    actions: {

        clear() {
            this.units.splice(0, this.units.length);
            this.attachmentFiles.splice(0, this.attachmentFiles.length);
            this.attachmentImages.splice(0, this.attachmentImages.length);
        },

        setBillingAddressSameAsShippingAddress() {
            this.print_order.billing_address = <IAddressBilling>{
                type: BILLING_ADDRESS_TYPE_INDIVIDUAL,
            }

            Object.assign(this.print_order.billing_address, this.print_order.shipping_address)
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
                estimated_time: Math.round(this.getETASeconds).toString(),
                eta: this.print_order?.eta
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

            const screenshotFile = new File([await (await fetch(unit.screenshotURL)).blob()], 'screenshot.jpg', { type: "image/jpg" });

            var formData = new FormData();
            formData.append("comment", unit.comment);
            formData.append("spool", unit.spool.id.toString());
            formData.append("infill", unit.infill.id.toString());
            formData.append("wall", unit.wall.id.toString());
            formData.append('wall_thickness', unit.wall_thickness.id.toString())
            formData.append('printing_method', unit.printing_method.id.toString());
            formData.append('scale', unit.scale.toString())
            formData.append("file", unit.file);
            formData.append('quantity', unit.quantity.toString());
            formData.append('length_unit', unit.length_unit)
            formData.append('rotation_unit', unit.rotation_unit)
            formData.append("estimated_price", unit.estimated_price.toFixed(2));
            formData.append('estimated_time', unit.estimated_time.toString())
            formData.append('model_volume', unit.model_volume.toString());
            formData.append('model_dimensions', unit.model_dimensions)
            formData.append('model_rotation', unit.model_rotation)
            formData.append('optimal_rotation', unit.optimal_rotation);
            formData.append('use_optimal_rotation', unit.use_optimal_rotation.toString())
            formData.append('screenshot', screenshotFile)

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
            }), HTTP_3D_MODEL_POST_REQUEST_TIMEOUT);
        },

        async estimatePrintJobsOnly() {
            const config = useRuntimeConfig();

            const authStore = useAuthStore();
            const dialogStore = useDialogStore();
            const notificationStore = useNotificationStore();

            if (!authStore.loggedIn) {
                dialogStore.open('AuthForm', {})
                notificationStore.show('Please log in to use this feature', ToastLevelType.info);
                this.print_order.eta = undefined;
                return;
            }

            // * Null indicates loading
            this.print_order.eta = null;

            console.debug("Websockets: Opening...")

            // * First we connect to websocket
            const {
                supported,
                ws,
                send,
                close,
                messageEvent,
                errorEvent,
                data,
                isOpen,
                isClosed,
                errored,
            } = useWebSocket(`${config.public.baseWsURL}ws/print-order/estimation/print-job-ending-time/`);

            let isDataWebsocketMessageReceived = false;

            // * Set initial wait for Websocket to get 'init' message from server
            new Promise(resolve => setTimeout(resolve, TIMEOUT_WS_PRINT_JOB_ETA_ESTIMATION_DATA_MESSAGE)).then(() => {
                if (!isDataWebsocketMessageReceived) {
                    console.debug('Timeout on websocket waiting to receive data message. Closing websocket')

                    // * Null indicates error
                    this.print_order.eta = undefined;

                    close();
                } else {
                    // * Init message is received, no need for closing of the websocket connection
                }
            });

            watch(data, value => {
                console.debug(`Websockets message = ${value}`)
                let parsedData = JSON.parse(value);

                switch (parsedData.type) {
                    case 'data':
                        const estimated_ending_time = parsedData.data?.estimated_ending_time;

                        if (!estimated_ending_time) {
                            console.debug(`Websockets: Incomplete data message. Estimated ending time = ${estimated_ending_time}`)

                            // * Null indicates error
                            this.print_order.eta = undefined;

                            close();
                            return;
                        }

                        isDataWebsocketMessageReceived = true;

                        this.print_order.eta = estimated_ending_time;

                        close();
                        break;
                    case 'error':
                        const errorMessage = parsedData.error;
                        console.error(`Websocket error: ${errorMessage}`)
                        notificationStore.show(`Websocket error: ${errorMessage}`);

                        // * Null indicates error
                        this.print_order.eta = undefined;

                        break;
                    case 'close':
                        const reason = parsedData.data?.reason;
                        console.debug(`Websockets: close signal ${reason} received. Closing...`)
                        close();
                        console.debug('Websockets: Closed')

                        break;
                    default:
                        console.debug('Unknown Websocket message type. Requesting websocket connection close...')
                        close();
                        console.debug('Websockets: Closed')
                        break;
                }

                console.debug('Websockets: Message received')
                console.debug(value)
            })

            watch(isOpen, value => {

                console.debug(`Websockets: isOpen=${value}`)

                if (value) {
                    console.debug("Websockets: Opened")

                    const body = JSON.stringify(this.units.filter(el => el.estimated_time).map(el => {
                        return {
                            quantity: el.quantity,
                            material: el.spool.material,
                            estimated_time: el.estimated_time
                        }
                    }))

                    send(body);
                }
            })

            watch(isClosed, value => {
                console.debug("Websockets: Closing...")
                close()
                console.debug("Websockets: Closed")
            })
        },

        async estimateSlicerAndPrintJobs(unit: IPrintOrderUnit) {
            const config = useRuntimeConfig();

            const authStore = useAuthStore();
            const dialogStore = useDialogStore();
            const notificationStore = useNotificationStore();

            if (!authStore.loggedIn) {
                dialogStore.open('AuthForm', {})
                notificationStore.show('Please log in to use this feature', ToastLevelType.info);

                this.updateUnit(unit.localUrl, {
                    estimated_time: Number.POSITIVE_INFINITY,
                    estimated_price: Number.POSITIVE_INFINITY
                })

                this.print_order.eta = undefined;

                return;
            }

            const simplifiedFile = new File([await (await fetch(unit.simplifiedFileUrl)).blob()], 'simplified-file.stl');

            var formData = new FormData();
            formData.append("comment", unit.comment);
            formData.append("spool", unit.spool.id.toString());
            formData.append("infill", unit.infill.id.toString());
            formData.append("wall", unit.wall.id.toString());
            formData.append('wall_thickness', unit.wall_thickness.id.toString());
            formData.append('printing_method', unit.printing_method.id.toString());
            formData.append('scale', (unit.scale * (unit.length_unit === DimensionUnit.mms ? 1 : 2.54)).toString())
            formData.append('local_url', unit.localUrl);
            formData.append("file", simplifiedFile);
            formData.append('quantity', unit.quantity.toString());
            formData.append('length_unit', unit.length_unit)
            formData.append('rotation_unit', unit.rotation_unit)
            formData.append("estimated_price", Number(0).toString());
            formData.append('estimated_time', Number(0).toString())
            formData.append('model_volume', unit.model_volume.toString());
            formData.append('model_dimensions', unit.model_dimensions)
            formData.append('model_rotation', unit.model_rotation)
            formData.append('optimal_rotation', unit.optimal_rotation);
            formData.append('use_optimal_rotation', unit.use_optimal_rotation.toString())
            formData.append('other_units', JSON.stringify(this.units.filter(el => el.localUrl !== unit.localUrl && el.estimated_time).map(el => {
                return {
                    quantity: el.quantity,
                    material: el.spool.material,
                    estimated_time: el.estimated_time
                }
            })))

            // * Negative infinity indicates loading
            this.updateUnit(unit.localUrl, {
                estimated_time: Number.NEGATIVE_INFINITY,
                estimated_price: Number.NEGATIVE_INFINITY
            })

            // * Null indicates loading
            this.print_order.eta = null;

            console.debug("Websockets: Opening...")

            // * First we connect to websocket
            const {
                supported,
                ws,
                send,
                close,
                messageEvent,
                errorEvent,
                data,
                isOpen,
                isClosed,
                errored,
            } = useWebSocket(`${config.public.baseWsURL}ws/print-order/estimation/slicer-and-print-job-ending-time/`);

            let isInitWebsocketMessageReceived = false;
            let isDataWebsocketMessageReceived = false;

            // * Set initial wait for Websocket to get 'init' message from server
            new Promise(resolve => setTimeout(resolve, TIMEOUT_WS_SLICER_ESTIMATION_INIT_MESSAGE)).then(() => {
                if (!isInitWebsocketMessageReceived) {
                    console.debug('Timeout on websocket waiting to receive init message. Closing websocket')

                    this.updateUnit(unit.localUrl, {
                        estimated_time: Number.POSITIVE_INFINITY,
                        estimated_price: Number.POSITIVE_INFINITY
                    })

                    // * Null indicates error
                    this.print_order.eta = undefined;

                    close();
                } else {
                    // * Init message is received, no need for closing of the websocket connection
                }
            });

            watch(data, value => {
                console.debug(`Websockets message = ${value}`)
                let parsedData = JSON.parse(value);

                switch (parsedData.type) {
                    case 'init':
                        const channel_group_name = parsedData.data?.channel_group_name;

                        if (!channel_group_name) {
                            console.debug('Websocket of message type "init" should have key named "channel_group_name". Requesting websocket connection close...')
                            close();
                        }

                        isInitWebsocketMessageReceived = true;

                        promiseWithTimeout<IPrintOrderUnit>(new Promise((resolve, reject) => {
                            customFetch<IPrintOrderUnit>(`api/slicer-estimation/?channel_group_name=${channel_group_name}`, {
                                baseURL: config.public.baseURL,
                                method: 'POST',
                                body: formData,
                            }).then((response: IPrintOrderUnit) => {
                                resolve(response)
                            }).catch(err => {
                                reject(err)
                            });
                        }), HTTP_REQUEST_TIMEOUT);

                        // * Set initial wait for Websocket to get 'data' message from server
                        new Promise(resolve => setTimeout(resolve, TIMEOUT_WS_SLICER_ESTIMATION_DATA_MESSAGE)).then(() => {
                            if (!isDataWebsocketMessageReceived) {
                                console.debug('Timeout on websocket waiting to receive data message. Closing websocket')

                                this.updateUnit(unit.localUrl, {
                                    estimated_time: Number.POSITIVE_INFINITY,
                                    estimated_price: Number.POSITIVE_INFINITY
                                })

                                // * Null indicates error
                                this.print_order.eta = undefined;

                                close();
                            } else {
                                // * Init message is received, no need for closing of the websocket connection
                            }
                        });

                        break;
                    case 'data':
                        const estimated_time = parsedData.data?.estimated_time;
                        const estimated_price = parsedData.data?.estimated_price;
                        const estimated_ending_time = parsedData.data?.estimated_ending_time;

                        if (!estimated_time || !estimated_price || !estimated_ending_time) {
                            console.debug(`Websockets: Incomplete data message. Estimated time = ${estimated_time}. Estimated price = ${estimated_price}`)

                            this.updateUnit(unit.localUrl, {
                                estimated_time: Number.POSITIVE_INFINITY,
                                estimated_price: Number.POSITIVE_INFINITY
                            })

                            // * Null indicates error
                            this.print_order.eta = undefined;

                            close();
                            return;
                        }

                        isDataWebsocketMessageReceived = true;

                        this.updateUnit(unit.localUrl, {
                            estimated_time: estimated_time,
                            estimated_price: estimated_price
                        })

                        this.print_order.eta = estimated_ending_time;

                        close();
                        break;
                    case 'error':
                        const errorMessage = parsedData.error;
                        console.error(`Websocket error: ${errorMessage}`)
                        notificationStore.show(`Websocket error: ${errorMessage}`);

                        // * Positive infinity indicates ERROR
                        this.updateUnit(unit.localUrl, {
                            estimated_time: Number.POSITIVE_INFINITY,
                            estimated_price: Number.POSITIVE_INFINITY
                        })

                        // * Null indicates error
                        this.print_order.eta = undefined;

                        break;
                    case 'close':
                        const reason = parsedData.data?.reason;
                        console.debug(`Websockets: close signal ${reason} received. Closing...`)
                        close();
                        console.debug('Websockets: Closed')

                        break;
                    default:
                        console.debug('Unknown Websocket message type. Requesting websocket connection close...')
                        close();
                        console.debug('Websockets: Closed')
                        break;
                }

                console.debug('Websockets: Message received')
                console.debug(value)
            })

            watch(isOpen, value => {
                console.debug("Websockets: Opened")
            })

            watch(isClosed, value => {
                console.debug("Websockets: Closing...")
                close()
                console.debug("Websockets: Closed")
            })
        },

        async postPrintOrderAttachmentFile(item: IAttachmentFile, orderId: number): Promise<IAttachmentFile> {
            return postAttachmentFile(item, CONTENT_TYPE_ORDER, orderId);
        },

        async postPrintOrderUnitAttachmentFile(item: IAttachmentFile, orderUnitId: number) {
            return postAttachmentFile(item, CONTENT_TYPE_ORDER_UNIT, orderUnitId);
        },

        addUnit(unit: IPrintOrderUnit) {
            this.units.push(unit);

            this.estimateSlicerAndPrintJobs(unit)
        },

        addDuplicate(unit: IPrintOrderUnit) {
            const unitClone = { ...unit };

            unitClone.localUrl = URL.createObjectURL(unit.file as File);
            unitClone.id = undefined;

            this.units.push(unitClone);

            this.estimatePrintJobsOnly()
        },

        async add3dModelFile(file: File, onFinishedCallback: (localUrl: string) => void, invalidFormatMessage: string) {
            if (!listContains(PRINT_ORDER_FILES_TYPES, file.type) && !listContains(PRINT_ORDER_FILES_SUFFIXES, urlExtractFileSuffix(file.name.toLowerCase()))) {
                const notificationStore = useNotificationStore();
                notificationStore.show(`${invalidFormatMessage}`, ToastLevelType.error);
                return;
            }

            const filamentSpoolStore = useFilamentSpoolStore();
            const printOrderUnitInfillWallCombinationStore = usePrintOrderUnitInfillWallCombinationStore();
            const printOrderUnitWallStore = usePrintOrderUnitWallStore();
            const printingMethodStore = usePrintingMethodStore();
            const globalsStore = useGlobalsStore();

            if (!filamentSpoolStore.getAll.length) {
                console.error(`Cannot add file as 3d model. No default filament color found`);
                return;
            }

            if (!printOrderUnitWallStore.getWallThicknesses.length) {
                console.error(`Cannot add file as 3d model. No default infill-walls combination found`)
            }

            if (!printOrderUnitInfillWallCombinationStore.getAll.length) {
                console.error(`Cannot add file as 3d model. No default wall thickness found`);
                return;
            }

            if (!printingMethodStore.getPrintingMethods.length) {
                console.error(`Cannot add file as 3d model. No default printing method found`)
                return;
            }

            const localUrl = URL.createObjectURL(file);
            const { model_volume, model_dimensions, optimal_rotation, model_rotation } = await preprocess3dObject(localUrl);

            create3dObjectScreenshot(localUrl, filamentSpoolStore.getAll[0].color.value, 400, 400, (blob, simplifiedModelBlob) => {

                const unit = <IPrintOrderUnit>{
                    id: undefined,
                    quantity_display: 1,
                    quantity: 1,
                    spool_display: filamentSpoolStore.getAll[0],
                    spool: filamentSpoolStore.getAll[0],
                    infill_display: printOrderUnitInfillWallCombinationStore.getAll[0].infill, // ! Watch out must be part of same combination
                    infill: printOrderUnitInfillWallCombinationStore.getAll[0].infill, // ! Watch out must be part of same combination
                    wall_display: printOrderUnitInfillWallCombinationStore.getAll[0].wall, // ! Watch out must be part of same combination
                    wall: printOrderUnitInfillWallCombinationStore.getAll[0].wall, // ! Watch out must be part of same combination
                    wall_thickness_display: printOrderUnitWallStore.getWallThicknesses[0],
                    wall_thickness: printOrderUnitWallStore.getWallThicknesses[0],
                    infill_wall_combination_display: printOrderUnitInfillWallCombinationStore.getAll[0],
                    infill_wall_combination: printOrderUnitInfillWallCombinationStore.getAll[0],
                    scale_display: 1.0,
                    scale: 1.0,
                    estimated_price: Number.NEGATIVE_INFINITY,
                    estimated_time: Number.NEGATIVE_INFINITY,
                    file: file,
                    simplifiedFileUrl: URL.createObjectURL(simplifiedModelBlob),
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
                    use_optimal_rotation_display: true,
                    use_optimal_rotation: true,
                    length_unit_display: DimensionUnit[globalsStore.getDimensionUnit],
                    length_unit: DimensionUnit[globalsStore.getDimensionUnit],
                    rotation_unit: RotationUnit[globalsStore.getRotationUnit],
                    screenshotURL: URL.createObjectURL(blob),
                    screenshot: '',
                    printing_method_display: printingMethodStore.getPrintingMethods[0],
                    printing_method: printingMethodStore.getPrintingMethods[0],
                };
                // ! First add unit to pinia state, then call slicer because slicer 
                // ! manipulates some  data of pinia state regarding this particular unit
                this.addUnit(unit);

                onFinishedCallback(localUrl);
            })
        },

        async updateScreenshot(localUrl: string, forceColor: string | undefined = undefined) {
            const unit = this.getUnitByLocalUrl(localUrl);

            if (!unit) {
                console.log(`Cannot update screenshot. Unit with local URL ${localUrl} does not exist`);
                return;
            }

            await create3dObjectScreenshot(localUrl, forceColor || unit.spool.color.value, 400, 400, (blob, simplifiedBlob) => {
                this.updateUnit(localUrl, { screenshotURL: URL.createObjectURL(blob), simplifiedFileUrl: URL.createObjectURL(simplifiedBlob) });
            })
        },

        async updateUnit(localUrl: string, fieldUpdate: any) {

            //todo check if field exist in unit 
            // todo check if value is of good type

            const index = this.units.findIndex(el => el.localUrl === localUrl);

            if (index != -1) {
                const unit = this.units[index];

                const updatedUnit = Object.assign(unit, fieldUpdate)

                this.units[index] = updatedUnit;

                let performSlicerAndPrintJobETAEstimation = false;
                let performOnlyPrintJobETAEstimation = false;

                Object.keys(fieldUpdate).forEach(el => {

                    if (listContains(PRINT_ORDER_UNIT_FIELDS_SLICER_ESTIMATION, el)) {
                        performSlicerAndPrintJobETAEstimation = true;
                    }
                    if (
                        listContains(PRINT_ORDER_UNIT_FIELDS_JOB_ETA_ESTIMATION, el)) {
                        performOnlyPrintJobETAEstimation = true;
                    }
                });

                if (performSlicerAndPrintJobETAEstimation) {
                    await this.estimateSlicerAndPrintJobs(this.units[index])
                } else if (performOnlyPrintJobETAEstimation) {
                    await this.estimatePrintJobsOnly();
                }
            }
        },

        setUnitPrintingMethod(localUrl: string, printing_method: IPrintingMethod) {
            if (!printing_method.supported_materials.length) {
                console.debug(`No supported materials for printing method ${printing_method.name}`)
                return;
            }

            const filamentSpoolStore = useFilamentSpoolStore();

            const material = printing_method.supported_materials[0];
            const spoolsWithSelectedMaterial = filamentSpoolStore.getSpoolsWithMaterial(material);

            if (!spoolsWithSelectedMaterial.length) {
                console.debug(`No spools for material ${material.name}`)
                return;
            }

            this.updateUnit(localUrl, { printing_method: printing_method, spool: spoolsWithSelectedMaterial[0] })
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
