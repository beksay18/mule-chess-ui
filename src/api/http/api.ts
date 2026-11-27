import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    AxiosRequestConfig,
} from "axios";
import axios from "axios";
import pRetry, {AbortError} from "p-retry";
import {get} from "lodash";
import {requestInterceptor, responseInterceptor, responseErrorInterceptor} from "./interceptors";

type AllowedActions = "get" | "post" | "put" | "delete";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface RetryableAxiosInstance extends AxiosInstance {
    getWithRetries: <T>(
        url: string,
        config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<T>>;

    postWithRetries: <T, K>(
        url: string,
        data?: K,
        config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<T>>;

    putWithRetries: <T, K>(
        url: string,
        data?: K,
        config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<T>>;

    deleteWithRetries: <T>(
        url: string,
        config?: AxiosRequestConfig
    ) => Promise<AxiosResponse<T>>;
}

const MAX_RETRIES = 2;

const instance: RetryableAxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {"Content-Type": "application/json"},
}) as RetryableAxiosInstance;

instance.interceptors.request.use(requestInterceptor);
instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

const executeAxiosRequest = async <T>({
                                          action,
                                          url,
                                          config,
                                          data,
                                      }: {
    action: AllowedActions,
    url: string,
    config?: AxiosRequestConfig,
    data?: unknown
}): Promise<T> => {
    const request: Promise<AxiosResponse<any>> = ["get", "delete"].includes(action)
        ? instance[action](url, config)
        : instance[action](url, data, config);

    return request.catch((error: AxiosError): void => {
        const status: number = Number(get(error, "response.status"));
        if (status && status >= 500) {
            throw error;
        }

        throw new AbortError(error);
    }) as Promise<T>;
};

const retryableAxiosRequest =
    (action: AllowedActions) =>
        <T, K = any>(
            url: string,
            data?: K,
            config?: AxiosRequestConfig
        ): Promise<AxiosResponse<T>> =>
            pRetry(
                () => executeAxiosRequest({ action, url, data, config }),
                { retries: MAX_RETRIES }
            );

instance.getWithRetries = retryableAxiosRequest("get");
instance.postWithRetries = retryableAxiosRequest("post");
instance.putWithRetries = retryableAxiosRequest("put");
instance.deleteWithRetries = retryableAxiosRequest("delete");

export default instance;
