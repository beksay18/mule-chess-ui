import { CONFIG } from 'src/config-global';

import { AccountProfileView } from 'src/sections/account/account-profile-view';

export default function Page() {
    return (
        <>
            <title>{`Profile - ${CONFIG.appName}`}</title>
            <AccountProfileView />
        </>
    );
}
