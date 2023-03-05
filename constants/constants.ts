export const RESTRICTED_PAGES_STARTS_WITH = [
    '/profile',
]

export const HTTP_REQUEST_TIMEOUT = 5000;

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

// * Payment

export const PAYMENT_ORDER_NAMES = ['printing', 'modeling', 'store'];
export const TAX_FRACTION = 0.25;

// ! IMPORTANT ! For every change in server side (django choices) 
// ! IMPORTANT ! adjust frontend enums (constants.vue)
export class OrderStatus {

    public static readonly reviewing = new OrderStatus('reviewing', 'Reviewing', '#ced4da');
    public static readonly estimatingPrice = new OrderStatus('estimating_price', 'Estimating price', '#eae4e9');
    public static readonly rejected = new OrderStatus('rejected', 'Rejected', '#f28482');
    public static readonly awaitingPayment = new OrderStatus('awaiting_payment', 'Awaiting payment', '#FFE19C')
    public static readonly inProgress = new OrderStatus('in_progress', 'In progress', '#90e0ef');
    public static readonly shipped = new OrderStatus('shipped', 'Shipped', '#e7bc91');
    public static readonly delivered = new OrderStatus('delivered', 'Delivered', '#99e2b4');

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