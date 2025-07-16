import { CONFIG } from 'src/config-global';

import {ProfileView} from "../../sections/home/profile/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Profile - ${CONFIG.appName}`}</title>

      <ProfileView />
    </>
  );
}
