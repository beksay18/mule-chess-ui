import { CONFIG } from 'src/config-global';

import Header from "../sections/home/header";
import {ContactFormView} from "../sections/home/contact-form/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Contact Us - ${CONFIG.appName}`}</title>
      <Header/>
      <ContactFormView />
    </>
  );
}
