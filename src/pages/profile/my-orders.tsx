import { CONFIG } from 'src/config-global';
import {MyOrdersView} from "../../sections/home/profile/my-orders/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`My Orders - ${CONFIG.appName}`}</title>

      <MyOrdersView />
    </>
  );
}
