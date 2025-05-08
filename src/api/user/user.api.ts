import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {UserResponsePage} from "./type";

export const getAllUsers = ({page, size, filter}: {
    page: number;
    size: number;
    filter?: string;
}): Promise<UserResponsePage> =>
    axios.getWithRetries<UserResponsePage>(
        `${ENDPOINTS.USER.GET_ALL_USERS}?page=${page}&size=${size}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`
    ).then(({data}) => data);
