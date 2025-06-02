import {PaginatedResponse} from "../order";

export interface ContactsContent {
    id: number;
    name: string,
    email: string,
    orderNumber: string,
    message: string,
    fileUrl: string,
    dateCreated: string,
}

export interface ContactsResponse {
    message: string
}

export type ContactResponsePage = PaginatedResponse<ContactsContent>;

export interface ContactsRequest {
    name: string;
    email: string;
    orderNumber: string;
    message: string;
    file?: File;
}


