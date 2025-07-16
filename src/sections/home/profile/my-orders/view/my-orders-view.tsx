import MyOrdersPage from "../my-orders-page";
import Header from "../../../header";
import {ProfileMenu} from "../../view/profile-menu";

export function MyOrdersView() {
  return (
    <>
      <Header/>
      <ProfileMenu/>
      <MyOrdersPage/>
    </>
  );
}
