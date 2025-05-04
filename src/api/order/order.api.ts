import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import { OrderRequest, OrderResponse } from "./type";

export const createOrder = (
    payload: OrderRequest
): Promise<OrderResponse> =>
    axios
        .postWithRetries<OrderResponse, OrderRequest>(
            ENDPOINTS.ORDER.CREATE_ORDER,
            payload,
            undefined
        )
        .then(({ data }) => data);

