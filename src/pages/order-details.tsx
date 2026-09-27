import { useState } from 'react';
import { DashboardLayout } from '../layouts/dashboard';
import { OrderDetailsView } from '../sections/orders/order-details/view';

export default function Page() {
    const [orderNumber, setOrderNumber] = useState<string>();

    return (
        <DashboardLayout orderNumber={orderNumber}>
            <OrderDetailsView setOrderStatus={() => undefined} setOrderNumber={setOrderNumber} />
        </DashboardLayout>
    );
}
