export const BACKGROUND_COLOR = "#f8f9fa";

// * Restrict non-auth user to access anything but index page => /
export const RESTRICT_ALL_NON_INDEX_PAGES_FOR_GUESTS = true;

export const RESTRICTED_PAGES_STARTS_WITH = [
    '/profile',
]

export const HTTP_REQUEST_TIMEOUT = 15000;

export const CONTENT_TYPE_ORDER_UNIT = 'orderunit';
export const CONTENT_TYPE_ORDER = 'printorder';
export const CONTENT_TYPE_MODELING_ORDER = 'modelingorder';
export const CONTENT_TYPE_BLOG = 'blog';
export const CONTENT_TYPE_PRODUCT = 'product';

export const TOAST_DURATION_MEDIUM = 5000;

export const MODELING_ORDER_ATTACHMENT_FILE_TYPES = [
    'application/pdf', 'text/plain',
]
export const MODELING_ORDER_ATTACHMENT_IMAGE_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png',
]

export const MAX_CART_ITEMS = 99;
export const MAX_PRINT_QUANTITY = 299;

export const MAX_FILE_SIZE_STL = 150 * 1024 * 1024 // MB

export const PAGE_SIZE = 10;

export const PRICE_MARGIN_FACTOR = 3.0;

// * Printing duration constants
export const LAYER_HEIGHT = 0.15; // millimeters
export const LAYER_WIDTH = 0.45; // millimeters
export const LAYER_AREA = LAYER_HEIGHT * LAYER_WIDTH;

export const PRINT_ORDER_FILES_TYPES = ['model/stl'];

// * Use lowercase suffixes because all
// * file suffixes are turned in lowercase
export const PRINT_ORDER_FILES_SUFFIXES = ['stl'];
export const PRINT_ORDER_MIN_PRICE = 1;

// * Billing address types

export const BILLING_ADDRESS_TYPE_INDIVIDUAL = 'individual';
export const BILLING_ADDRESS_TYPE_COMPANY = 'company';

export const BILLING_ADDRESS_TYPES = [
    { value: BILLING_ADDRESS_TYPE_INDIVIDUAL, label: capitalizeOnlyFirstLetter(BILLING_ADDRESS_TYPE_INDIVIDUAL) },
    { value: BILLING_ADDRESS_TYPE_COMPANY, label: capitalizeOnlyFirstLetter(BILLING_ADDRESS_TYPE_COMPANY) },
]

// * Payment

export const PAYMENT_ORDER_NAMES = ['printing', 'modeling', 'store'];
export const TAX_FRACTION = 0.25;

// ! IMPORTANT ! For every change in server side (django choices) 
// ! IMPORTANT ! adjust frontend enums (constants.vue)
export class OrderStatus {

    public static readonly reviewing = new OrderStatus('reviewing', 'Reviewing', '#219ebc');
    public static readonly estimatingPrice = new OrderStatus('estimating_price', 'Estimating price', '#eae4e9');
    public static readonly rejected = new OrderStatus('rejected', 'Rejected', '#f28482');
    public static readonly awaitingPayment = new OrderStatus('awaiting_payment', 'Awaiting payment', '#ee9b00')
    public static readonly inProgress = new OrderStatus('in_progress', 'In progress', '#277da1');
    public static readonly shipped = new OrderStatus('shipped', 'Shipped', '#d4a373');
    public static readonly delivered = new OrderStatus('delivered', 'Delivered', '#415a77');

    public static readonly all: { [key: string]: OrderStatus } = {
        'reviewing':
            this.reviewing,
        'estimating_price':
            this.estimatingPrice,
        'rejected':
            this.rejected,
        'awaiting_payment':
            this.awaitingPayment,
        'in_progress':
            this.inProgress,
        'shipped':
            this.shipped,
        'delivered':
            this.delivered,
    }

    private constructor(public readonly server_name: string, public readonly display_name: string, public readonly colorHex: string) {
    }
}