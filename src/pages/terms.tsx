import { CONFIG } from 'src/config-global';

import Header from '../sections/home/header';
import { TermsView } from '../sections/home/legal/view';

export default function Page() {
    return (
        <>
            <title>{`Terms of Service - ${CONFIG.appName}`}</title>
            <Header />
            <TermsView />
        </>
    );
}
