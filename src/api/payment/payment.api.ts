import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {PaymentIntentRequest, PaymentIntentResponse} from "./type";

export const createPaymentIntent = (
    payload: PaymentIntentRequest
): Promise<PaymentIntentResponse> =>
    axios
        .postWithRetries<PaymentIntentResponse, PaymentIntentRequest>(
            ENDPOINTS.PAYMENT.CREATE_PAYMENT,
            payload,
            {
                headers: {
                    'x-skip-auth': 'true',
                },
            }
        )
        .then(({ data }) => data);

