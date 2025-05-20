import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {CustomerOrderResponse} from "./type";

export const getOrderById = (id: number): Promise<CustomerOrderResponse> =>
    axios
        .getWithRetries<CustomerOrderResponse>(ENDPOINTS.ORDER.GET_ORDER_BY_ID(id))
        .then(({ data }) => data);
