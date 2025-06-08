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
        GET_ACTIVE_PRODUCTS: (id: number | string) => `/cg-stickers/api/products/public/${id}`,
    },
    ORDER: {
        CREATE_ORDER: "/cg-stickers/api/orders/create",
        CREATE_PAYMENT_INTENT: "/cg-stickers/api/orders/create-payment-intent",
        GET_ALL_ORDERS: "/cg-stickers/api/orders/all-orders",
        GET_ORDER_BY_ID: (id: number | string) => `/cg-stickers/api/orders/overview/${id}`,
        NEW_COUNT: "/cg-stickers/api/orders/new-count",
        START_PROCESSING: (id: number | string) => `/cg-stickers/api/orders/${id}/start-processing`,
        READY_TO_SHIP: (id: number | string) => `/cg-stickers/api/orders/${id}/ready-to-ship`,
    },
    USER: {
        GET_ALL_USERS: "/cg-stickers/api/user/all-users",
    },
    PROFILE: {
        CHANGE_PASSWORD: (userId: number | string) => `/cg-stickers/api/profile/change-password/${userId}`,
        UPDATE_PERSONAL_INFO: (userId: number | string) => `/cg-stickers/api/profile/edit-personal-info/${userId}`,
    },
    SHIPPING_ADDRESS: {
        CREATE_SHIPPING: (userId: number) => `/cg-stickers/api/shipping-address/${userId}`,
        GET_ALL_SHIPPING: (userId: number) => `/cg-stickers/api/shipping-address/${userId}`,
        DELETE_SHIPPING: (userId: number, id: number) => `/cg-stickers/api/shipping-address/${userId}/${id}`,
    },
    CONTACTS: {
        GET_ALL_CONTACTS: "/cg-stickers/api/contacts/all-contacts",
        CREATE_CONTACT: "/cg-stickers/api/contacts/save-contacts",
        MARK_DONE: (id: number) => `/cg-stickers/api/contacts/mark-done/${id}`,
        NEW_COUNT: "/cg-stickers/api/contacts/new-count",
    },
}