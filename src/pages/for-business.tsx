import { CONFIG } from 'src/config-global';

import Header from '../sections/home/header';
import { ForBusinessView } from '../sections/home/company/for-business/view/for-business-view';

export default function Page() {
    return (
        <>
            <title>{`For Businesses - ${CONFIG.appName}`}</title>
            <Header />
            <ForBusinessView />
        </>
    );
}
