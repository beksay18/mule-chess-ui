import { SignInRequest, SignInResponse } from "./type";
import { axios } from "../http";
import { ENDPOINTS } from "../constant";

export const signIn = (
    payload: SignInRequest
): Promise<SignInResponse> =>
    axios
        .postWithRetries<SignInResponse, SignInRequest>(
            ENDPOINTS.AUTH.SIGN_IN,
            payload,
            undefined
        )
        .then(({ data }) => data);