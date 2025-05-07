export interface OrderRequest {
    userId?: number;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    lineItems: LineItemRequest[];
    shippingAddress: ShippingAddressRequest;
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
    firstName: string;
    lastName: string;
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
    shippingAddress: ShippingAddressResponse;
    lineItems: LineItemResponse[];
}

export interface ShippingAddressResponse {
    firstName: string;
    lastName: string;
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

