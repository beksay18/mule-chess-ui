import { CONFIG } from 'src/config-global';

import {ContactsView} from "../sections/contacts/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Contacts - ${CONFIG.appName}`}</title>

      <ContactsView />
    </>
  );
}
