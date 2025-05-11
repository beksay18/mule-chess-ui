import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {ProfileActionResponse, ProfileRequest, ProfileResponse} from "./type";

export const getProfile = (id: number): Promise<ProfileResponse> =>
    axios
        .getWithRetries<ProfileResponse>(ENDPOINTS.PROFILE.GET_PROFILE_VIEW(id))
        .then(({ data }) => data);

export const updateProfile = (
    id: number,
    payload: ProfileRequest
): Promise<ProfileActionResponse> =>
    axios
        .postWithRetries<ProfileActionResponse, ProfileRequest>(
            ENDPOINTS.PROFILE.UPDATE_PROFILE(id),
            payload,
            undefined
        )
        .then(({ data }) => data);
