import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {OrderRequest, OrderResponse, OrderResponsePage} from "./type";

export const createOrder = (
    payload: OrderRequest
): Promise<OrderResponse> =>
    axios
        .postWithRetries<OrderResponse, OrderRequest>(
            ENDPOINTS.ORDER.CREATE_ORDER,
            payload,
            {
                headers: {
                    'x-skip-auth': 'true',
                },
            })
        .then(({data}) => data);

export const getAllOrders = ({page, size, filter}: {
    page: number;
    size: number;
    filter?: string;
}): Promise<OrderResponsePage> =>
    axios.getWithRetries<OrderResponsePage>(
        `${ENDPOINTS.ORDER.GET_ALL_ORDERS}?page=${page}&size=${size}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`
    ).then(({data}) => data);
