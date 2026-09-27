import {PaginatedResponse} from "../order";

export interface ContactsContent {
    id: number;
    name: string,
    email: string,
    orderNumber: string,
    message: string,
    fileUrl: string,
    dateCreated: string,
    contactStatus: string;
}

export interface ContactsResponse {
    message: string
}

export type ContactResponsePage = PaginatedResponse<ContactsContent>;

export interface ContactReply {
    id: number;
    message: string;
    fileUrl?: string;
    fileName?: string;
    sentAt: string;
    authorName?: string;
}

export interface ContactsRequest {
    name: string;
    email: string;
    orderNumber: string;
    message: string;
    file?: File;
}


