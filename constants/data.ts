// ************** //
// **** USER **** //
// ************** //

export interface IUserLogin {
    access_token: string,
    refresh_token: string,
    user: IUser | undefined
}

export interface IUser {
    id: number,
    email: string,
    is_staff: boolean,
    profile: IProfile | undefined
}

export interface IProfile {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    shipping_address: IAddressShipping,
    billing_address: IAddressBilling,
    phone_number: string,
}

export interface IAddressShipping {
    first_name: string,
    last_name: string,
    address: string,
    country: string,
    state: string | undefined,
    locality: string,
    postal_code: string,
    phone_number: string,
}

export interface IAddressBilling {
    type: string, // * 'company' or 'individual'

    first_name: string | undefined, // * Used only if type === 'individual'
    last_name: string | undefined, // * Used only if type === 'individual'

    address: string, // * Used for both
    country: string, // * Used for both
    state: string | undefined, // * Used for both
    locality: string, // * Used for both
    postal_code: string, // * Used for both
    phone_number: string, // * Used for both

    contact_first_name: string | undefined, // * Used only if type === 'company'
    contact_last_name: string | undefined, // * Used only if type === 'company'
    company_name: string | undefined, // * Used only if type === 'company'
    vat_id: string | undefined, // * Used only if type === 'company'
}

// **************** //
// **** COMMON **** //
// **************** //

import { Vector3 } from "three"

export interface IAttachmentFile {
    id: number,
    file: File | string,
    comment: string,
    localUrl: string,
}

export interface IAttachmentImage {
    id: number,
    image: File | string,
    comment: string,
    localUrl: string,
}

export interface ILike {
    id: number,
    user: IUser,
    content_type: string,
    object_id: number,
}

export interface IRating {
    id: number,
    content: string,
    value: number,
    user: IUser | number,
    content_type: string,
    object_id: number,
    created_at: string,
    updated_at: string,
}

export interface IComment {
    id: number,
    content: string,
    user: IUser,
    created_at: string,
    updated_at: string,
}

// ******************** //
// **** PAGINATION **** //
// ******************** //

export interface IPaginatedResponse<T> {
    count: number,
    next: string,
    previous: string,
    results: T[]
}

// ************** //
// **** BLOG **** //
// ************** //

export interface IBlogCategory {
    id: number,
    name: string,
}

export interface IBlogSubcategory {
    id: number,
    name: string,
    category: IBlogCategory,
}

export interface IBlogTag {
    id: number,
    name: string,
}

export interface IBlog {
    id: number,
    title: string,
    subtitle: string,
    content: string,
    author: IUser,
    category: IBlogCategory,
    subcategory: IBlogSubcategory,
    tags: IBlogTag[],
    is_featured: boolean,
    like_count: number,
    liked_by_me: boolean,
    comment_count: number,
    created_at: string,
    updated_at: string,
    picture: string,
}

// ************************* //
// **** SHIPPING METHOD **** //
// ************************* //

export interface IShippingMethod {
    id: number,
    provider: string,
    description: string,
    price: number
}

// ****************** //
// **** FILAMENT **** //
// ****************** //

export interface IFilamentColor {
    id: number,
    name: string,
    value: string
}

export interface IFilamentMaterial {
    id: number,
    name: string,
    description: string,
    density: number,
}

export interface IFilamentSpool {
    id: number,
    material: IFilamentMaterial,
    color: IFilamentColor,
}

// ************* //
// ** PRODUCT ** //
// ************* //

export interface IProduct {
    id: number,
    title: string,
    description: string,
    comment_count: number,
    like_count: number,
    rating_count: number,
    productvariationoption_set: IProductVariationOption[],
    productimage_set: IProductImage[],
    starting_price: number,
    ending_price: number,
    average_rating: number,
    rated_by_me: boolean,
    category: IProductCategory,
    subcategory: IProductSubcategory,
}

export interface IProductCategory {
    id: number,
    name: string,
}

export interface IProductSubcategory {
    id: number,
    name: string,
}

export interface IProductVariation {
    id: number,
    name: string,
}

export interface IProductVariationOption {
    id: number,
    title: string,
    description: string,
    type: IProductVariation,
}

export interface IProductVariationOptionCombination {
    id: number,
    price: number,
    sku: number,
    product: IProduct,
    options: IProductVariationOption[],
}

export interface IProductImage {
    image: string,
    comment: string,
}

// ************************** //
// **** PRINT ORDER UNIT **** //
// ************************** //

export interface IPrintOrderUnit {
    id: number | undefined,
    comment: string,

    quantity: number,

    spool_display: IFilamentSpool,
    spool: IFilamentSpool,

    infill_display: IPrintOrderUnitInfill,
    infill: IPrintOrderUnitInfill,

    wall_display: IPrintOrderUnitWall,
    wall: IPrintOrderUnitWall,

    wall_thickness_display: IPrintOrderUnitWallThickness,
    wall_thickness: IPrintOrderUnitWallThickness,

    infill_wall_combination_display: IPrintOrderUnitInfillWallCombination,
    infill_wall_combination: IPrintOrderUnitInfillWallCombination,

    scale_display: number,
    scale: number,

    printing_method_display: IPrintingMethod,
    printing_method: IPrintingMethod,

    file: File | string,
    simplifiedFileUrl: string,
    localUrl: string,
    attachmentFiles: IAttachmentFile[],
    attachmentImages: IAttachmentImage[],
    order: number | undefined,
    model_dimensions: string,
    model_volume: number,

    model_rotation_display: string,
    model_rotation: string,

    optimal_rotation: string,
    
    use_optimal_rotation_display: boolean,
    use_optimal_rotation: boolean,

    length_unit_display: string,
    length_unit: string,

    rotation_unit: string,
    screenshotURL: string,
    estimated_price: number,
    estimated_time: number,
    screenshot: string,
}

export interface IPrintOrderUnitInfill {
    id: number,
    name: string,
    percentage: number
}

export interface IPrintOrderUnitWall {
    id: number,
    amount: number,
}

export interface IPrintOrderUnitWallThickness {
    id: number,
    thickness: number,
}

export interface IPrintOrderUnitInfillWallCombination {
    id: number,
    name: string,
    infill: IPrintOrderUnitInfill,
    wall: IPrintOrderUnitWall,
}

// ********************* //
// **** PRINT ORDER **** //
// ********************* //

export interface IPrintOrder {
    id: number,
    created_at: string,
    updated_at: string,
    units: IPrintOrderUnit[],
    unit_count: number,
    comment: string,
    attachmentFiles: IAttachmentFile[],
    attachmentImages: IAttachmentImage[],
    user_profile: number,
    contact_email: string,
    shipping_address: IAddressShipping,
    billing_address: IAddressBilling,
    shipping_method: IShippingMethod,
    payment_method: string,
    estimated_price: number,
    estimated_time: number,

    // * null - waiting
    // * undefined - error
    // * non-empty string - valid value
    eta: string | undefined | null,
    status: string,
}

// ************************ //
// **** MODELING ORDER **** //
// ************************ //

export interface IModelingOrder {
    id: number,
    created_at: string,
    updated_at: string,
    comment: string,
    attachmentFiles: IAttachmentFile[],
    attachmentImages: IAttachmentImage[],
    contact_email: string,
    estimated_price: number,
    status: string,
    item_type: IModelingOrderItemType,
    item_attributes: IModelingOrderItemAttribute[],
    order_type: IModelingOrderOrderType,
}

export interface IModelingOrderOrderType {
    id: number,
    name: string,
    icon_name: string,
}

export interface IModelingOrderItemType {
    id: number,
    name: string,
    icon_name: string,
}

export interface IModelingOrderItemAttribute {
    id: number,
    name: string,
    description: string | null,
}

// ***************** //
// ** STORE ORDER ** //
// ***************** //

export interface IStoreOrder {
    id: number,
    items: IStoreOrderUnit[],
    created_at: string,
    updated_at: string,
    contact_email: string,
    shipping_address: IAddressShipping,
    billing_address: IAddressBilling,
    shipping_method: IShippingMethod,
    total_price: number,
    payment_method: string,
    status: string,
}

export interface IStoreOrderUnit {
    id: number,
    quantity: number,
    order: number,
    item: IProductVariationOptionCombination
}

// ************* //
// ** PAYMENT ** //
// ************* //

export interface IPaymenIntent {
    clientSecret: string,
}

// ************* //
// ** PRINTER ** //
// ************* //

export interface IPrinterType {
    id: number,
    name: string,
    printing_method: IPrintingMethod,
    printer_count: number,
    picture: string,
    max_print_size: string,
    max_resolution: number,
    supported_materials: IFilamentMaterial[],
}

export interface IPrinter {
    id: number,
    name: string,
    type: IPrinterType,
    available: boolean,
}

export interface IPrintingMethod {
    id: number,
    name: string,
    full_name: string,
    resolution: number,
    precision: number,
    smoothness: number,
    pricing: number,
    supported_materials: IFilamentMaterial[],
    printer_type_picture: string,
}

// *************** //
// ** PRINT JOB ** //
// *************** //

export interface IPrintingJob {
    id: number,
    created_at: string,
    print_order_unit: IPrintOrderUnit,
    printer: number,
    duration: number,
    start_at: string,
    end_at: string,
    status: string,
}

// ********* //
// ** FAQ ** //
// ********* //

export interface IFaqCategory {
    id: number,
    name: string,
    description: string,
    picture: string,
}

export interface IFaqBlog {
    id: number,
    title: string,
    subtitle: string,
    content: string,
    category: IBlogCategory,
    created_at: string,
    updated_at: string,
    picture: string,
}

// ! ************************************************ //
// ! ************************************************ //
// ! ************************************************ //
// ! ************************************************ //

// ********************************* //
// ** NON-REST-API RELATED MODELS ** //
// ********************************* //

export interface ITab {
    title: string,
    iconName?: string,
}