import MyShippingAddressesPage from "../my-shipping-addresses-page";
import Header from "../../../header";
import {ProfileMenu} from "../../view/profile-menu";
import Footer from "../../../footer";

export function MyShippingAddressesView() {
  return (
    <>
      <Header/>
      <ProfileMenu/>
      <MyShippingAddressesPage/>
      <Footer />
    </>
  );
}
