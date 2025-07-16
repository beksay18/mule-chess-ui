import { CONFIG } from 'src/config-global';
import {MyShippingAddressesView} from "../../sections/home/profile/my-shipping-addresses/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`My Shipping Addresses - ${CONFIG.appName}`}</title>

      <MyShippingAddressesView />
    </>
  );
}
