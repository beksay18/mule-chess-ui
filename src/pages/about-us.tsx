import { CONFIG } from 'src/config-global';

import Header from "../sections/home/header";
import {AboutUsView} from "../sections/home/company/about-us/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`About Us - ${CONFIG.appName}`}</title>
      <Header/>
      <AboutUsView />
    </>
  );
}
