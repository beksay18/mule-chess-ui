import { CONFIG } from 'src/config-global';

import {HomeView} from "../sections/home/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Home - ${CONFIG.appName}`}</title>

      <HomeView />
    </>
  );
}
