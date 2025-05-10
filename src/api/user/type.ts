import {PaginatedResponse} from "../order";

export type UserResponsePage = PaginatedResponse<UserContent>;

export interface UserContent {
    userId: number;
    username: string;
    dateCreated: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    active: boolean;
    provider: string;
}


