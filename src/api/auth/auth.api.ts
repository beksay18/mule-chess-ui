import {MessageResponse, SignInRequest, SignInResponse, SignUpRequest} from "./type";
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

export const signUp = (
    payload: SignUpRequest
): Promise<MessageResponse> =>
    axios
        .postWithRetries<MessageResponse, SignUpRequest>(
            ENDPOINTS.AUTH.SIGN_UP,
            payload,
            undefined
        )
        .then(({ data }) => data);