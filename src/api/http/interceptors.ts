import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {fetchAndValidateAccessToken} from "./utils";

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