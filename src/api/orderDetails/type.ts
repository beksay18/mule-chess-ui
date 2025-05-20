export type CustomerOrderResponse = {
    orderNumber: string;
    customerUser: CustomerUserDTO;
    customerEmail: string;
    customerPhone: string;
    customerFirstName: string;
    customerLastName: string;
    shippingAddress: ShippingAddressResponse;
    orderStatus: string;
    totalAmount: number;
    dateCreated: string;
    lineItems: LineItemResponse[];
    payment: PaymentDTO;
};

export type CustomerUserDTO = {
    provider: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
};

export type ShippingAddressResponse = {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

export type LineItemResponse = {
    productId: number;
    productName: string;
    imageUrl: string;
    width: number;
    height: number;
    quantity: number;
    percentage: number;
    isCustomDimension: boolean;
};

export type PaymentDTO = {
    paymentMethodId: string;
    paymentIntentId: string;
    paymentStatus: string;
    amount: number;
    currency: string;
    order: string;
    createdAt: string; // ISO string
};
