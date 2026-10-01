import {GoogleClientIdResponse, GoogleSignInRequest, MessageResponse, SignInRequest, SignInResponse, SignUpRequest} from "./type";
import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import { logout } from "../session-storage";

const skipAuthHeader = { headers: { 'x-skip-auth': 'true' } };

export const signIn = (
    payload: SignInRequest
): Promise<SignInResponse> =>
    axios
        .postWithRetries<SignInResponse, SignInRequest>(
            ENDPOINTS.AUTH.SIGN_IN,
            payload,
            skipAuthHeader
        )
        .then(({ data }) => data);

export const signUp = (
    payload: SignUpRequest
): Promise<MessageResponse> =>
    axios
        .postWithRetries<MessageResponse, SignUpRequest>(
            ENDPOINTS.AUTH.SIGN_UP,
            payload,
            skipAuthHeader
        )
        .then(({ data }) => data);

export const loginWithGoogle = (
    payload: GoogleSignInRequest
): Promise<SignInResponse> =>
    axios
        .postWithRetries<SignInResponse, GoogleSignInRequest>(
            ENDPOINTS.AUTH.LOGIN_WITH_GOOGLE,
            payload,
            skipAuthHeader
        )
        .then(({ data }) => data);

const authMailConfig = { headers: { 'x-skip-auth': 'true' }, timeout: 30000 };

export const requestPasswordReset = (username: string, lastName: string): Promise<MessageResponse> =>
    axios
        .postWithRetries<MessageResponse, { username: string; lastName: string }>(
            ENDPOINTS.AUTH.FORGOT_PASSWORD,
            { username, lastName },
            authMailConfig
        )
        .then(({ data }) => data);

export const confirmPasswordReset = (
    username: string,
    lastName: string,
    code: string
): Promise<MessageResponse> =>
    axios
        .postWithRetries<MessageResponse, { username: string; lastName: string; code: string }>(
            ENDPOINTS.AUTH.FORGOT_PASSWORD_CONFIRM,
            { username, lastName, code },
            authMailConfig
        )
        .then(({ data }) => data);

export const getGoogleClientId = (): Promise<string> =>
    axios
        .getWithRetries<GoogleClientIdResponse>(ENDPOINTS.AUTH.GOOGLE_CLIENT_ID, skipAuthHeader)
        .then(({ data }) => data.googleClientId);

export async function logoutSession() {
    try {
        await axios.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
        // The browser session is still cleared below.
    }
    logout();
}