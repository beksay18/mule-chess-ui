export const ENDPOINTS = {
    AUTH: {
        SIGN_IN: "/cg-stickers/api/auth/signin",
        SIGN_UP: "/cg-stickers/api/auth/signup",
        FORGOT_PASSWORD: "/cg-stickers/api/auth/forgot-password",
        LOGIN_WITH_GOOGLE: "/cg-stickers/api/auth/login-with-google",
        REFRESH_TOKEN: "/cg-stickers/api/auth/refresh-token"
    },
    PRODUCT_TYPE: {
        GET_ALL_PRODUCT_TYPES: "/cg-stickers/api/product-types",
        GET_PRODUCT_TYPE_BY_ID: (id: number | string) => `/cg-stickers/api/product-types/${id}`,
        CREATE_PRODUCT_TYPE: "/cg-stickers/api/product-types",
        UPDATE_PRODUCT_TYPE: (id: number | string) => `/cg-stickers/api/product-types/${id}`,
        DELETE_PRODUCT_TYPE: (id: number | string) => `/cg-stickers/api/product-types/${id}`,
        GET_ACTIVE_PRODUCT_TYPES: "/cg-stickers/api/product-types/public",
    },
    PRODUCT: {
        GET_ALL_PRODUCTS: "/cg-stickers/api/products",
        GET_PRODUCT_BY_ID: (id: number | string) => `/cg-stickers/api/products/${id}`,
        CREATE_PRODUCT: "/cg-stickers/api/products",
        UPDATE_PRODUCT: (id: number | string) => `/cg-stickers/api/products/${id}`,
        DELETE_PRODUCT: (id: number | string) => `/cg-stickers/api/products/${id}`,
        GET_ACTIVE_PRODUCTS: "/cg-stickers/api/products/public",
    },
}