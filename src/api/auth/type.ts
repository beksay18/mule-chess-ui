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
    userId: number;
    username: string;
    role: string;
    person: {
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
    };
}

export interface SignUpRequest {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface MessageResponse {
    message: string;
}

export type GoogleSignInRequest = {
    idToken: string;
};