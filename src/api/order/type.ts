export interface OrderRequest {
    userId?: number;
    customerEmail: string;
    customerPhone: string;
    customerFirstName: string;
    customerLastName: string;
    totalAmount: number;
    lineItems: LineItemRequest[];
    shippingAddress: ShippingAddressRequest;
    paymentMethodId: string;
}

export interface LineItemRequest {
    productId: number;
    width: number;
    height: number;
    quantity: number;
    percentage: number;
    customDimension: boolean;
}

export interface ShippingAddressRequest {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface OrderResponse {
    orderNumber: string;
    totalAmount: number;
    dateCreated: string;
    orderStatus: string;
    userId: number;
    customerEmail: string;
    customerPhone: string;
    customerFirstName: string;
    customerLastName: string;
    shippingAddress: ShippingAddressResponse;
    lineItems: LineItemResponse[];
}

export interface ShippingAddressResponse {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface LineItemResponse {
    productId: number;
    productName: string;
    width: number;
    height: number;
    quantity: number;
    percentage: number;
    isCustomDimension: boolean;
}

export type OrderResponsePage = PaginatedResponse<OrderContent>;

export interface OrderContent {
    orderId: number;
    orderNumber: string;
    totalAmount: number;
    dateCreated: string;
    orderStatus: string;
    customerEmail: string;
    customerPhone: string;
    customerFirstName: string;
    customerLastName: string;
    paymentStatus: string;
    city: string;
    state: string;
}

export interface PaginatedResponse<T> {
    totalPages: number;
    totalElements: number;
    size: number;
    content: T[];
    number: number;
    sort: SortInfo;
    pageable: Pageable;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface SortInfo {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    offset: number;
    sort: SortInfo;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
];
