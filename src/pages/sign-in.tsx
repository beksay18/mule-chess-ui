import Box from '@mui/material/Box';

import { CONFIG } from 'src/config-global';

import { SignInView } from 'src/sections/auth/view';
import Header from '../sections/home/header';
import ScrollRevealFooter from '../sections/home/scroll-reveal-footer';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>
      <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: '#f6f8fb' }}>
        <Header />
        <SignInView />
        <ScrollRevealFooter />
      </Box>
    </>
  );
}
