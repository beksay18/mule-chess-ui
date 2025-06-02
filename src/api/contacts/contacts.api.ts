import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import {ContactResponsePage, ContactsRequest, ContactsResponse} from "./type";

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
