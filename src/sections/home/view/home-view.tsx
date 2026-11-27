import HomeOverview from "../home-overview";
import Footer from "../footer";
import Header from "../header";
import HelpOverview from "../help-overview";

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <Header/>
      <HomeOverview/>
      <HelpOverview />
      <Footer/>
    </>
  );
}
