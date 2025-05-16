import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {MessageResponse, ProfileRequest, PasswordRequest, PersonResponse} from "./type";

export const changePassword = (
    userId: number,
    payload: PasswordRequest
): Promise<MessageResponse> =>
    axios
        .putWithRetries<MessageResponse, PasswordRequest>(
            ENDPOINTS.PROFILE.CHANGE_PASSWORD(userId),
            payload,
            undefined
        )
        .then(({ data }) => data);

export const updatePersonalInfo = (
    userId: number,
    payload: ProfileRequest
): Promise<PersonResponse> =>
    axios
        .postWithRetries<PersonResponse, ProfileRequest>(
            ENDPOINTS.PROFILE.UPDATE_PERSONAL_INFO(userId),
            payload,
            undefined
        )
        .then(({ data }) => data);
