import ProfilePage from "../profile-page";
import Header from "../../header";
import {ProfileMenu} from "./profile-menu";

export function ProfileView() {
  return (
    <>
      <Header/>
      <ProfileMenu/>
      <ProfilePage/>
    </>
  );
}
