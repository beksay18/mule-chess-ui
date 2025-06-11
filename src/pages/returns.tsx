import { CONFIG } from 'src/config-global';

import Header from "../sections/home/header";
import {ReturnsView} from "../sections/home/support/returns/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Returns - ${CONFIG.appName}`}</title>
      <Header/>
      <ReturnsView />
    </>
  );
}
