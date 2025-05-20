import { CONFIG } from 'src/config-global';

import {OrderDetailsView} from "../sections/orders/order-details/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Orders Details- ${CONFIG.appName}`}</title>

      <OrderDetailsView />
    </>
  );
}
