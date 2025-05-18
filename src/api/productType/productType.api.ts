import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import { ProductType, ProductTypeRequest } from "./type";

export const createProductType = (payload: ProductTypeRequest): Promise<ProductType> => {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("isActive", String(payload.isActive));
        if (payload.image) {
                formData.append("image", payload.image);
        }

        return axios
            .post<ProductType>(ENDPOINTS.PRODUCT_TYPE.CREATE_PRODUCT_TYPE, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
            })
            .then(({ data }) => data);
};

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
): Promise<ProductType> => {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("isActive", String(payload.isActive));
        if (payload.image) {
                formData.append("image", payload.image);
        }

        return axios
            .put<ProductType>(ENDPOINTS.PRODUCT_TYPE.UPDATE_PRODUCT_TYPE(id), formData, {
                    headers: { "Content-Type": "multipart/form-data" }
            })
            .then(({ data }) => data);
};


export const deleteProductType = (id: number): Promise<void> =>
    axios
        .deleteWithRetries<void>(ENDPOINTS.PRODUCT_TYPE.DELETE_PRODUCT_TYPE(id))
        .then(() => {});
