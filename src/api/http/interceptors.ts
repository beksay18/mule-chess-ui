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

export const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
        SessionStorage.clear();
        window.location.href = "/";
    }

    return Promise.reject(error);
};