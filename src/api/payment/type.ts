export type PaymentIntentRequest = {
    amount: number;
    orderNumber: string;
};

export type PaymentIntentResponse = {
    clientSecret: string;
};