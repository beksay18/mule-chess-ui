export interface ProfileRequest {
    firstName: string;
    lastName: string;
    oldPassword: string;
    newPassword: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface ProfileActionResponse {
    message: string;
}

export interface ProfileResponse {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    shippingAddress: ProfileShippingAddressResponse;
}

export interface ProfileShippingAddressResponse {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}