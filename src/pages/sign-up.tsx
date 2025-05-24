import { CONFIG } from 'src/config-global';

import {SignUpView} from "../sections/auth/signUp/view";
import Header from "../sections/home/header";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign up - ${CONFIG.appName}`}</title>
      <Header/>
      <SignUpView />
    </>
  );
}
