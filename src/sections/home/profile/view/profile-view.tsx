import ProfilePage from '../profile-page';
import { ProfileLayout } from './profile-layout';

export function ProfileView() {
    return (
        <ProfileLayout>
            <ProfilePage />
        </ProfileLayout>
    );
}
