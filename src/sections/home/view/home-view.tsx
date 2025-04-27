import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Logo } from 'src/components/logo';
import HomeOverview from "../home-overview";
import HomeProducts from "../home-products";
import Footer from "../footer";
import Header from "../header";

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <Header/>
      <HomeOverview/>
      <HomeProducts/>
      <Footer/>
    </>
  );
}
