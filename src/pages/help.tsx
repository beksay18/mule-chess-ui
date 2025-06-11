import { CONFIG } from 'src/config-global';

import Header from "../sections/home/header";
import {HelpView} from "../sections/home/support/help/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Help - ${CONFIG.appName}`}</title>
      <Header/>
      <HelpView />
    </>
  );
}
