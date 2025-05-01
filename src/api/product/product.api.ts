import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import {Product, ProductRequest} from "./type";

export const createProduct = (
    payload: ProductRequest
): Promise<Product> =>
    axios
        .postWithRetries<Product, ProductRequest>(
            ENDPOINTS.PRODUCT.CREATE_PRODUCT,
            payload,
            undefined
        )
        .then(({ data }) => data);

export const getAllProducts = (): Promise<Product[]> =>
    axios
        .getWithRetries<Product[]>(ENDPOINTS.PRODUCT.GET_ALL_PRODUCTS)
        .then(({ data }) => data);

export const getActiveProducts = (id: number): Promise<Product[]> =>
    axios
        .getWithRetries<Product[]>(ENDPOINTS.PRODUCT.GET_ACTIVE_PRODUCTS(id))
        .then(({ data }) => data);

export const getProductById = (id: number): Promise<Product> =>
    axios
        .getWithRetries<Product>(ENDPOINTS.PRODUCT.GET_PRODUCT_BY_ID(id))
        .then(({ data }) => data);


export const updateProduct = (
    id: number,
    payload: ProductRequest
): Promise<Product> =>
    axios
        .putWithRetries<Product, ProductRequest>(
            ENDPOINTS.PRODUCT.UPDATE_PRODUCT(id),
            payload,
            undefined
        )
        .then(({ data }) => data);


export const deleteProduct = (id: number): Promise<void> =>
    axios
        .deleteWithRetries<void>(ENDPOINTS.PRODUCT.DELETE_PRODUCT(id))
        .then(() => {});
