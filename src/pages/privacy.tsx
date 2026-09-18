import { CONFIG } from 'src/config-global';

import Header from '../sections/home/header';
import { PrivacyView } from '../sections/home/legal/view';

export default function Page() {
    return (
        <>
            <title>{`Privacy Policy - ${CONFIG.appName}`}</title>
            <Header />
            <PrivacyView />
        </>
    );
}
