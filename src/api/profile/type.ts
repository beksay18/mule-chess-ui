export interface ProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface MessageResponse {
    message: string;
}

export interface PasswordRequest {
    oldPassword: string;
    newPassword: string;
}
