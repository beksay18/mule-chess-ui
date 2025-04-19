import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {fetchAndValidateAccessToken} from "./utils";

export const requestInterceptor = (
    req: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => ({
        ...req,
        headers: {
            ...req.headers,
            Authorization: `Bearer ${fetchAndValidateAccessToken()}`,
        }
    } as unknown as InternalAxiosRequestConfig);

export const responseInterceptor = (res: AxiosResponse): AxiosResponse => res;