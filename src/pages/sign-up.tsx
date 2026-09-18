import { CONFIG } from 'src/config-global';

import { SignUpView } from '../sections/auth/signUp/view';
import Header from '../sections/home/header';
import ScrollRevealFooter from '../sections/home/scroll-reveal-footer';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign up - ${CONFIG.appName}`}</title>
      <Header />
      <SignUpView />
      <ScrollRevealFooter />
    </>
  );
}
