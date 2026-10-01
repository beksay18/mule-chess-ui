import { CONFIG } from 'src/config-global';

import Header from '../sections/home/header';
import ScrollRevealFooter from '../sections/home/scroll-reveal-footer';
import { ForgotPasswordView } from '../sections/auth/forgot-password-view';

export default function Page() {
    return (
        <>
            <title>{`Forgot password - ${CONFIG.appName}`}</title>
            <Header />
            <ForgotPasswordView />
            <ScrollRevealFooter />
        </>
    );
}
