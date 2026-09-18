import MyOrdersPage from '../my-orders-page';
import { ProfileLayout } from '../../view/profile-layout';

export function MyOrdersView() {
    return (
        <ProfileLayout>
            <MyOrdersPage />
        </ProfileLayout>
    );
}
