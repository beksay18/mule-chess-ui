import type { ReactNode } from 'react';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import Footer from '../home/footer';
import Header from '../home/header';
import { chessColors } from './theme';

// ----------------------------------------------------------------------

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function SiteShell({
  children,
}: {
  children: ReactNode;
  variant?: 'home' | 'banner' | 'plain';
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', color: chessColors.ink, display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, bgcolor: '#fff' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export function MissingEvent() {
  return (
    <SiteShell>
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          That event is not listed
        </Typography>
        <Typography sx={{ color: chessColors.muted, mb: 3 }}>
          It may have been removed. The tournament list has everything that is still open.
        </Typography>
        <Button component={RouterLink} href="/tournaments" variant="contained" sx={{ bgcolor: chessColors.green, '&:hover': { bgcolor: chessColors.greenHover } }}>
          Back to tournaments
        </Button>
      </Container>
    </SiteShell>
  );
}
