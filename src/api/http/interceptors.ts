import {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {fetchAndValidateAccessToken} from "./utils";
import {SessionStorage} from "../session-storage";

export const requestInterceptor = (
    req: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const headers = req.headers || {};

    const skipAuth = headers['x-skip-auth'];

    if (!skipAuth) {
        const token = fetchAndValidateAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    delete headers['x-skip-auth'];

    req.headers = headers;
    return req;
};

export const responseInterceptor = (res: AxiosResponse): AxiosResponse => res;

const AUTH_ENDPOINTS = ['/auth/signin', '/auth/signup', '/auth/login-with-google', '/auth/google-client-id'];

function isAuthRequest(url?: string) {
    if (!url) {
        return false;
    }
    return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

export const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if ((status === 401 || status === 403) && !isAuthRequest(requestUrl)) {
        SessionStorage.clear();
        window.location.href = '/sign-in';
    }

    return Promise.reject(error);
};