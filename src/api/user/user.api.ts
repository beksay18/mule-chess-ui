import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {RoleOption, UpdateUserAccessRequest, UserResponsePage} from "./type";

export const getAllUsers = ({page, size, filter}: {
    page: number;
    size: number;
    filter?: string;
}): Promise<UserResponsePage> =>
    axios.getWithRetries<UserResponsePage>(
        `${ENDPOINTS.USER.GET_ALL_USERS}?page=${page}&size=${size}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`
    ).then(({data}) => data);

export const getAllRoles = (): Promise<RoleOption[]> =>
    axios.getWithRetries<RoleOption[]>(ENDPOINTS.USER.GET_ALL_ROLES).then(({ data }) => data);

export const updateUserAccess = (
    userId: number,
    payload: UpdateUserAccessRequest
): Promise<{ message: string }> =>
    axios
        .putWithRetries<{ message: string }, UpdateUserAccessRequest>(
            ENDPOINTS.USER.UPDATE_ACCESS(userId),
            payload
        )
        .then(({ data }) => data);
