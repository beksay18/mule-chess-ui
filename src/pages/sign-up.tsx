import { CONFIG } from 'src/config-global';

import {SignUpView} from "../sections/auth/signUp/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign up - ${CONFIG.appName}`}</title>

      <SignUpView />
    </>
  );
}
