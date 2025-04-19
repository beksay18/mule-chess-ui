import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import pRetry, {AbortError} from "p-retry";
import {get} from "lodash";
import {requestInterceptor, responseInterceptor} from "./interceptors";

type AllowedActions = "get" | "post" | "put" | "delete";

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
}

const MAX_RETRIES = 2;

const instance: RetryableAxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 2000,
    headers: {"Content-Type": "application/json"},
}) as RetryableAxiosInstance;

instance.interceptors.request.use(requestInterceptor);
instance.interceptors.response.use(responseInterceptor);

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

export default instance;
