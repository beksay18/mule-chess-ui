import { getCurrentUser } from '../../../../api';
import ShippingAddressSection from './shipping-address-section';

export default function MyShippingAddressesPage() {
    const user = getCurrentUser();

    if (!user?.userId) {
        return null;
    }

    return <ShippingAddressSection userId={user.userId} />;
}
