import ProfilePage from "../profile-page";
import Header from "../../header";
import {ProfileMenu} from "./profile-menu";
import Footer from "../../footer";

export function ProfileView() {
  return (
    <>
      <Header/>
      <ProfileMenu/>
      <ProfilePage/>
      <Footer />
    </>
  );
}
