import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import {Product, ProductRequest} from "./type";

export const createProduct = (payload: ProductRequest): Promise<Product> => {
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("description", payload.description);
        formData.append("price", String(payload.price ?? 0));
        formData.append("isActive", String(payload.isActive));
        formData.append("productTypeId", String(payload.productTypeId ?? 0));
        formData.append("maxHeight", String(payload.maxHeight ?? 0));
        formData.append("maxWidth", String(payload.maxWidth ?? 0));
        formData.append("maxQuantity", String(payload.maxQuantity ?? 0));

        if (payload.position !== undefined && payload.position !== null) {
            formData.append("position", String(payload.position));
        }

        if (payload.image) {
                formData.append("image", payload.image);
        }

        if (payload.backgroundImage) {
                formData.append("backgroundImage", payload.backgroundImage);
        }

        formData.append("dimensions", JSON.stringify(payload.dimensions));
        formData.append("discounts", JSON.stringify(payload.discounts));

        return axios
            .post<Product>(ENDPOINTS.PRODUCT.CREATE_PRODUCT, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
            })
            .then(({ data }) => data);
};

export const getProductByProductTypeId = (id: number): Promise<Product> =>
    axios
        .getWithRetries<Product>(ENDPOINTS.PRODUCT.GET_PRODUCTS_BY_TYPE(id))
        .then(({ data }) => data);

export const getActiveProducts = (id: number): Promise<Product[]> =>
    axios
        .getWithRetries<Product[]>(ENDPOINTS.PRODUCT.GET_ACTIVE_PRODUCTS(id))
        .then(({ data }) => data);

export const getProductById = (id: number): Promise<Product> =>
    axios
        .getWithRetries<Product>(ENDPOINTS.PRODUCT.GET_PRODUCT_BY_ID(id))
        .then(({ data }) => data);


export const updateProduct = (id: number, payload: ProductRequest): Promise<Product> => {
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("description", payload.description);
        formData.append("price", String(payload.price ?? 0));
        formData.append("isActive", String(payload.isActive));
        formData.append("productTypeId", String(payload.productTypeId ?? 0));
        formData.append("maxHeight", String(payload.maxHeight ?? 0));
        formData.append("maxWidth", String(payload.maxWidth ?? 0));
        formData.append("maxQuantity", String(payload.maxQuantity ?? 0));

        if (payload.position !== undefined && payload.position !== null) {
            formData.append("position", String(payload.position));
        }

        if (payload.image) {
                formData.append("image", payload.image);
        }

        if (payload.backgroundImage) {
                formData.append("backgroundImage", payload.backgroundImage);
        }

        formData.append("dimensions", JSON.stringify(payload.dimensions));
        formData.append("discounts", JSON.stringify(payload.discounts));

        return axios
            .put<Product>(ENDPOINTS.PRODUCT.UPDATE_PRODUCT(id), formData, {
                    headers: { "Content-Type": "multipart/form-data" },
            })
            .then(({ data }) => data);
};

export const deleteProduct = (id: number): Promise<void> =>
    axios
        .deleteWithRetries<void>(ENDPOINTS.PRODUCT.DELETE_PRODUCT(id))
        .then(() => {});
