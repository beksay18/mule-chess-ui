import { CONFIG } from 'src/config-global';

import {FaqView} from "../sections/faq/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`FAQ - ${CONFIG.appName}`}</title>

      <FaqView />
    </>
  );
}
