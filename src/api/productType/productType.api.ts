import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import { ProductType, ProductTypeRequest } from "./type";

export const createProductType = (
    payload: ProductTypeRequest
): Promise<ProductType> =>
    axios
        .postWithRetries<ProductType, ProductTypeRequest>(
            ENDPOINTS.PRODUCT_TYPE.CREATE_PRODUCT_TYPE,
            payload,
            undefined
        )
        .then(({ data }) => data);

export const getAllProductTypes = (): Promise<ProductType[]> =>
    axios
        .getWithRetries<ProductType[]>(ENDPOINTS.PRODUCT_TYPE.GET_ALL_PRODUCT_TYPES)
        .then(({ data }) => data);

export const getActiveProductTypes = (): Promise<ProductType[]> =>
    axios
        .getWithRetries<ProductType[]>(ENDPOINTS.PRODUCT_TYPE.GET_ACTIVE_PRODUCT_TYPES)
        .then(({ data }) => data);

export const getProductTypeById = (id: number): Promise<ProductType> =>
    axios
        .getWithRetries<ProductType>(ENDPOINTS.PRODUCT_TYPE.GET_PRODUCT_TYPE_BY_ID(id))
        .then(({ data }) => data);


export const updateProductType = (
    id: number,
    payload: ProductTypeRequest
): Promise<ProductType> =>
    axios
        .putWithRetries<ProductType, ProductTypeRequest>(
            ENDPOINTS.PRODUCT_TYPE.UPDATE_PRODUCT_TYPE(id),
            payload,
            undefined
        )
        .then(({ data }) => data);


export const deleteProductType = (id: number): Promise<void> =>
    axios
        .deleteWithRetries<void>(ENDPOINTS.PRODUCT_TYPE.DELETE_PRODUCT_TYPE(id))
        .then(() => {});
