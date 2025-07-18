import MyOrdersPage from "../my-orders-page";
import Header from "../../../header";
import {ProfileMenu} from "../../view/profile-menu";
import Footer from "../../../footer";

export function MyOrdersView() {
  return (
    <>
      <Header/>
      <ProfileMenu/>
      <MyOrdersPage/>
      <Footer />
    </>
  );
}
