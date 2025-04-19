export interface SignInRequest {
    username: string;
    password: string;
}

export interface SignInResponse {
    message: string | null;
    id: number;
    username: string;
    role: string;
    person: {
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
    };
    accessToken: string;
    tokenType: string;
}

export interface CurrentUser {
    username: string;
    role: string;
    person: {
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
    };
}
