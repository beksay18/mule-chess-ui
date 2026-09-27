import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import {ContactReply, ContactResponsePage, ContactsRequest, ContactsResponse} from "./type";

export const createContacts = (payload: ContactsRequest): Promise<ContactsResponse> => {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("email", payload.email);
        formData.append("orderNumber", payload.orderNumber);
        formData.append("message", payload.message);
        if (payload.file) {
                formData.append("file", payload.file);
        }

        return axios
            .post<ContactsResponse>(ENDPOINTS.CONTACTS.CREATE_CONTACT, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
            })
            .then(({ data }) => data);
};

export const getAllContacts = ({page, size, filter}: {
    page: number;
    size: number;
    filter?: string;
}): Promise<ContactResponsePage> =>
    axios.getWithRetries<ContactResponsePage>(
        `${ENDPOINTS.CONTACTS.GET_ALL_CONTACTS}?page=${page}&size=${size}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`
    ).then(({data}) => data);

export const markContactAsDone = (id: number): Promise<void> =>
    axios.put<void>(ENDPOINTS.CONTACTS.MARK_DONE(id)).then(() => {});

export const getNewContactCount = (): Promise<number> =>
    axios.get<number>(ENDPOINTS.CONTACTS.NEW_COUNT).then(({ data }) => data);

export const getContactReplies = (id: number): Promise<ContactReply[]> =>
    axios.get<ContactReply[]>(ENDPOINTS.CONTACTS.REPLIES(id)).then(({ data }) => data);

export const replyToContact = (id: number, message: string, file?: File): Promise<ContactReply> => {
    const formData = new FormData();
    formData.append('message', message);
    if (file) {
        formData.append('file', file);
    }
    return axios
        .post<ContactReply>(ENDPOINTS.CONTACTS.REPLY(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000,
        })
        .then(({ data }) => data);
};