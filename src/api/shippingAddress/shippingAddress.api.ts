import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import {ShippingAddressRequest, ShippingAddressResponse} from "./type";

export const createOrUpdateShippingAddress = (
    userId: number,
    payload: ShippingAddressRequest
): Promise<ShippingAddressResponse> =>
    axios
        .postWithRetries<ShippingAddressResponse, ShippingAddressRequest>(
            ENDPOINTS.SHIPPING_ADDRESS.CREATE_SHIPPING(userId),
            payload
        )
        .then(({ data }) => data);

export const getShippingAddresses = (
    userId: number
): Promise<ShippingAddressResponse[]> =>
    axios
        .getWithRetries<ShippingAddressResponse[]>(ENDPOINTS.SHIPPING_ADDRESS.GET_ALL_SHIPPING(userId))
        .then(({ data }) => data);

export const deleteShippingAddress = (
    userId: number,
    id: number
): Promise<void> =>
    axios
        .deleteWithRetries<void>(ENDPOINTS.SHIPPING_ADDRESS.DELETE_SHIPPING(userId, id))
        .then(() => {});
