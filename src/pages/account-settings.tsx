import { CONFIG } from 'src/config-global';

import { AccountSettingsView } from 'src/sections/account/account-settings-view';

export default function Page() {
    return (
        <>
            <title>{`Settings - ${CONFIG.appName}`}</title>
            <AccountSettingsView />
        </>
    );
}
