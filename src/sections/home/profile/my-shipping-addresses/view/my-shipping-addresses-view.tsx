import MyShippingAddressesPage from "../my-shipping-addresses-page";
import Header from "../../../header";
import {ProfileMenu} from "../../view/profile-menu";

export function MyShippingAddressesView() {
  return (
    <>
      <Header/>
      <ProfileMenu/>
      <MyShippingAddressesPage/>
    </>
  );
}
