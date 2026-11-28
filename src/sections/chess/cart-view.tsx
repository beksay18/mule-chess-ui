import { useState } from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { money, locationLabel } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import { confirmCart, useChessState, removeFromCart } from './store';

import type { CartItem } from './types';

// ----------------------------------------------------------------------

const NAVY = '#12325f';

const cardSx = {
  bgcolor: '#fff',
  border: `1px solid ${alpha(NAVY, 0.08)}`,
  borderRadius: 3,
  boxShadow: `0 8px 24px ${alpha(NAVY, 0.04)}`,
  p: { xs: 2.5, md: 3.5 },
} as const;

export function CartView() {
  usePageTitle('Cart · Mule Chess');
  const chess = useChessState();
  const [receipt, setReceipt] = useState<CartItem[] | null>(null);
  const [notice, setNotice] = useState('');
  const total = chess.cart.reduce((sum, item) => sum + item.fee, 0);

  const confirm = () => {
    const count = chess.cart.length;
    setReceipt(chess.cart);
    confirmCart();
    setNotice(count === 1 ? '1 player is on the entry list.' : `${count} players are on the entry list.`);
  };

  return (
    <SiteShell>
      <Box sx={{ bgcolor: '#f6f8fb', borderTop: `1px solid ${alpha(NAVY, 0.06)}`, minHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100dvh - 72px)' } }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography sx={{ color: '#2888A0', fontWeight: 800, fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase' }}>
            Registration
          </Typography>
          <Typography component="h1" sx={{ mt: 0.75, mb: 3.5, color: NAVY, fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-0.03em' }}>
            Cart
          </Typography>

          {receipt && (
            <Box sx={{ ...cardSx, mb: 2 }}>
              <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: { xs: '1.35rem', md: '1.5rem' } }}>On the entry list</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {receipt.map((item) => {
                  const tournament = chess.tournaments.find((entry) => entry.id === item.tournamentId);
                  return (
                    <Box key={item.id} sx={{ px: 2, py: 1.75, borderRadius: 2, bgcolor: '#f7f9fc' }}>
                      <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: '1.2rem' }}>
                        {item.firstName} {item.lastName}
                      </Typography>
                      <Typography sx={{ mt: 0.4, color: alpha(NAVY, 0.65), fontSize: '1.05rem' }}>
                        {item.sectionName} · {tournament?.name ?? 'Tournament'}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
              <Button
                component={RouterLink}
                href="/tournaments"
                sx={{ mt: 2.5, px: 0, minWidth: 0, color: '#175195', fontWeight: 700, fontSize: '1.05rem', textTransform: 'none' }}
              >
                Join another event
              </Button>
            </Box>
          )}

          {!receipt && chess.cart.length === 0 && (
            <Box sx={{ ...cardSx, textAlign: 'center', py: { xs: 5, md: 6 } }}>
              <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: '1.35rem' }}>Your cart is empty</Typography>
              <Typography sx={{ mt: 0.75, color: alpha(NAVY, 0.65) }}>
                Pick a tournament and a section, then come back here to finish.
              </Typography>
              <Button
                component={RouterLink}
                href="/tournaments"
                variant="contained"
                sx={{ mt: 2.5, px: 3, bgcolor: '#175195', fontWeight: 700, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#124578' } }}
              >
                Find a tournament
              </Button>
            </Box>
          )}

          {!receipt && chess.cart.length > 0 && (
            <Box sx={cardSx}>
              <Stack spacing={1.5}>
                {chess.cart.map((item) => {
                  const tournament = chess.tournaments.find((entry) => entry.id === item.tournamentId);
                  return (
                    <Stack
                      key={item.id}
                      direction="row"
                      spacing={1.5}
                      sx={{
                        alignItems: 'center',
                        px: 1.5,
                        py: 1.5,
                        borderRadius: 2,
                        bgcolor: '#f7f9fc',
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: '1.1rem' }}>
                          {item.firstName} {item.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: NAVY, fontWeight: 700, mt: 0.25 }}>
                          {item.sectionName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha(NAVY, 0.6) }}>
                          {tournament?.name ?? 'Tournament'}
                          {tournament ? ` · ${locationLabel(tournament)}` : ''}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#175195', fontWeight: 800, fontSize: '1.15rem', flexShrink: 0 }}>{money(item.fee)}</Typography>
                      <IconButton aria-label={`Remove ${item.firstName} ${item.lastName}`} onClick={() => removeFromCart(item.id)} sx={{ color: alpha(NAVY, 0.55) }}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  );
                })}
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mt: 2.5, pt: 2, borderTop: `1px solid ${alpha(NAVY, 0.08)}` }}>
                <Typography sx={{ color: NAVY, fontWeight: 800 }}>Total</Typography>
                <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: '1.35rem' }}>{money(total)}</Typography>
              </Stack>
              <Typography sx={{ mt: 1, color: alpha(NAVY, 0.65), fontSize: 14 }}>
                Confirming adds these players to the entry list. The organizer collects the fee.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={confirm}
                sx={{ mt: 2, py: 1.15, bgcolor: '#175195', fontWeight: 700, borderRadius: 2, textTransform: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#124578' } }}
              >
                Confirm registration
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4000}
        onClose={(_event, reason) => {
          if (reason === 'clickaway') return;
          setNotice('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ top: { xs: 80, md: 88 } }}
      >
        <Alert severity="success" onClose={() => setNotice('')} sx={{ alignItems: 'center', boxShadow: 2 }}>
          {notice}
        </Alert>
      </Snackbar>
    </SiteShell>
  );
}
