import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {OrderRequest, OrderResponse, OrderResponsePage} from "./type";

export const createOrder = async (
    payload: OrderRequest
): Promise<OrderResponse> => {
    const formData = buildOrderFormData(payload);

    const { data } = await axios.post<OrderResponse>(
        ENDPOINTS.ORDER.CREATE_ORDER,
        formData,
        {
            headers: {
                'x-skip-auth': 'true',
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return data;
};

export const createPaymentIntent = (
    payload: OrderRequest
): Promise<{ clientSecret: string }> =>
    axios
        .postWithRetries<{ clientSecret: string }, OrderRequest>(
            ENDPOINTS.ORDER.CREATE_PAYMENT_INTENT,
            payload,
            {
                headers: {
                    'x-skip-auth': 'true',
                },
            }
        )
        .then(({ data }) => data);

export const getAllOrders = ({page, size, filter}: {
    page: number;
    size: number;
    filter?: string;
}): Promise<OrderResponsePage> =>
    axios.getWithRetries<OrderResponsePage>(
        `${ENDPOINTS.ORDER.GET_ALL_ORDERS}?page=${page}&size=${size}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`
    ).then(({data}) => data);


export const buildOrderFormData = (order: OrderRequest): FormData => {
    const formData = new FormData();

    if (order.userId) formData.append("userId", order.userId.toString());
    formData.append("customerEmail", order.customerEmail);
    formData.append("customerPhone", order.customerPhone);
    formData.append("customerFirstName", order.customerFirstName);
    formData.append("customerLastName", order.customerLastName);
    formData.append("totalAmount", order.totalAmount.toString());
    if (order.paymentIntentId) {
        formData.append("paymentIntentId", order.paymentIntentId);
    }

    Object.entries(order.shippingAddress).forEach(([key, value]) => {
        formData.append(`shippingAddress.${key}`, value);
    });

    order.lineItems.forEach((item, index) => {
        formData.append(`lineItems[${index}].productId`, item.productId.toString());
        formData.append(`lineItems[${index}].width`, item.width.toString());
        formData.append(`lineItems[${index}].height`, item.height.toString());
        formData.append(`lineItems[${index}].quantity`, item.quantity.toString());
        formData.append(`lineItems[${index}].percentage`, item.percentage.toString());
        formData.append(`lineItems[${index}].customDimension`, item.customDimension.toString());

        if ((item as any).artworkFiles) {
            (item as any).artworkFiles.forEach((file: File) => {
                formData.append(`lineItems[${index}].artworkFiles`, file);
            });
        }
    });

    return formData;
};
