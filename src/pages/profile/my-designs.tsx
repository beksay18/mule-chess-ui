import { CONFIG } from 'src/config-global';
import { MyDesignsView } from '../../sections/home/profile/my-designs/view';

export default function Page() {
    return (
        <>
            <title>{`My Designs - ${CONFIG.appName}`}</title>
            <MyDesignsView />
        </>
    );
}
