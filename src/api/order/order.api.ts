import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {MonthlyOrderReport, MyOrderResponsePage, OrderRequest, OrderResponse, OrderResponsePage, OrderStatusCount} from "./type";

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

export const getMyOrders = ({ page, size, filter, userId }: {
    page: number;
    size: number;
    filter?: string;
    userId?: number;
}): Promise<MyOrderResponsePage> =>
    axios.getWithRetries<MyOrderResponsePage>(
        `${ENDPOINTS.ORDER.GET_MY_ORDERS}?page=${page}&size=${size}` +
        `${filter ? `&filter=${encodeURIComponent(filter)}` : ''}` +
        `${userId ? `&userId=${userId}` : ''}`
    ).then(({ data }) => data);

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

    if (order.lineItems && order.lineItems.length > 0) {
        order.lineItems.forEach((item, index) => {
            formData.append(`lineItems[${index}].productId`, item.productId.toString());
            formData.append(`lineItems[${index}].width`, item.width.toString());
            formData.append(`lineItems[${index}].height`, item.height.toString());
            formData.append(`lineItems[${index}].quantity`, item.quantity.toString());
            formData.append(`lineItems[${index}].percentage`, item.percentage.toString());
            formData.append(`lineItems[${index}].customDimension`, item.customDimension.toString());

            if ((item as any).artworkFiles) {
                (item as any).artworkFiles.forEach((file: File) => {
                    if (file instanceof File) {
                        formData.append(`lineItems[${index}].artworkFiles`, file);
                    } else {
                        console.warn('Not a valid File:', file);
                    }
                });
            }
        });
    }

    return formData;
};

export const getNewOrdersCount = (): Promise<number> =>
    axios.get<number>(ENDPOINTS.ORDER.NEW_COUNT).then(({ data }) => data);

export const startProcessingOrder = async (orderId: number | string): Promise<{ message: string }> => {
    const { data } = await axios.put<{ message: string }>(
        ENDPOINTS.ORDER.START_PROCESSING(orderId)
    );
    return data;
};

export const markOrderReadyToShip = async (orderId: number | string): Promise<{ message: string }> => {
    const { data } = await axios.put<{ message: string }>(
        ENDPOINTS.ORDER.READY_TO_SHIP(orderId)
    );
    return data;
};

export const createLabel = async (orderId: number | string): Promise<{ message: string }> => {
    const { data } = await axios.put<{ message: string }>(
        ENDPOINTS.ORDER.CREATE_LABEL(orderId)
    );
    return data;
};

export const getMonthlyOrderReport = async (): Promise<MonthlyOrderReport[]> => {
    try {
        const { data } = await axios.get<MonthlyOrderReport[]>(ENDPOINTS.ORDER.MONTHLY_REPORT);
        if (Array.isArray(data)) {
            return data;
        }
    } catch {
        // Older API builds do not have this report yet.
    }
    return aggregateMonthlyOrders();
};

async function aggregateMonthlyOrders(): Promise<MonthlyOrderReport[]> {
    const months = new Map<string, MonthlyOrderReport>();
    let page = 0;
    let last = false;

    while (!last && page < 50) {
        const response = await getAllOrders({ page, size: 100 });
        const orders = response.content ?? [];
        orders.forEach((order) => {
            const placed = new Date(order.dateCreated);
            const year = placed.getFullYear();
            const month = placed.getMonth() + 1;
            const key = `${year}-${month}`;
            const row = months.get(key) ?? { year, month, orderCount: 0, revenue: 0 };
            row.orderCount += 1;
            if (order.orderStatus !== 'CANCELLED') {
                row.revenue += Number(order.totalAmount) || 0;
            }
            months.set(key, row);
        });
        last = response.last || orders.length === 0;
        page += 1;
    }

    return [...months.values()].sort((a, b) => a.year - b.year || a.month - b.month);
}

export const getOrderStatusCount = (userId?: string): Promise<OrderStatusCount[]> =>
    axios
        .get<OrderStatusCount[]>(ENDPOINTS.ORDER.STATUS_COUNT, {
            params: userId ? { userId } : undefined,
        })
        .then(({ data }) => data);