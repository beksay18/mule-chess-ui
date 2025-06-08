import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderById } from '../api/orderDetails';
import {DashboardLayout} from "../layouts/dashboard";
import {OrderDetailsView} from "../sections/orders/order-details/view";

export default function Page() {
    const { id } = useParams();
    const [orderStatus, setOrderStatus] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (id) {
            getOrderById(Number(id)).then(order => setOrderStatus(order.orderStatus));
        }
    }, [id]);

    return (
        <DashboardLayout orderStatus={orderStatus}>
            <OrderDetailsView setOrderStatus={setOrderStatus}/>
        </DashboardLayout>
    );
}
