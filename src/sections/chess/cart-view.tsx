import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { RouterLink } from 'src/routes/components';

import { locationLabel } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import { confirmCart, useChessState, removeFromCart } from './store';
import { chessColors, registerButtonSx } from './theme';

import type { CartItem } from './types';

// ----------------------------------------------------------------------

export function CartView() {
  usePageTitle('Cart · Mule Chess');
  const chess = useChessState();
  const [receipt, setReceipt] = useState<CartItem[] | null>(null);
  const total = chess.cart.reduce((sum, item) => sum + item.fee, 0);

  const confirm = () => {
    setReceipt(chess.cart);
    confirmCart();
  };

  return (
    <SiteShell>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Cart
        </Typography>

        {receipt && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {receipt.length === 1 ? '1 player is registered.' : `${receipt.length} players are registered.`} The entry
            list is updated. Registration is saved in this browser.
          </Alert>
        )}

        {receipt && (
          <Stack spacing={1} sx={{ mb: 3 }}>
            {receipt.map((item) => {
              const tournament = chess.tournaments.find((entry) => entry.id === item.tournamentId);
              return (
                <Typography key={item.id}>
                  {item.firstName} {item.lastName} · {item.sectionName} · {tournament?.name}
                </Typography>
              );
            })}
            <Button component={RouterLink} href="/tournaments" sx={{ alignSelf: 'flex-start', mt: 1 }}>
              Register another player
            </Button>
          </Stack>
        )}

        {!receipt && chess.cart.length === 0 && (
          <Stack spacing={2}>
            <Typography>Your cart is empty.</Typography>
            <Button component={RouterLink} href="/tournaments" variant="contained" sx={{ ...registerButtonSx, alignSelf: 'flex-start' }}>
              Browse tournaments
            </Button>
          </Stack>
        )}

        {!receipt && chess.cart.length > 0 && (
          <Stack spacing={1.5}>
            {chess.cart.map((item) => {
              const tournament = chess.tournaments.find((entry) => entry.id === item.tournamentId);
              return (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', borderBottom: `1px solid ${chessColors.line}`, py: 1.5 }}
                >
                  <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      {item.firstName} {item.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: chessColors.muted }}>
                      {tournament?.name ?? 'Tournament'} · {item.sectionName}
                      {tournament ? ` · ${locationLabel(tournament)}` : ''}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontWeight: 700 }}>${item.fee}</Typography>
                  <IconButton aria-label={`Remove ${item.firstName} ${item.lastName}`} onClick={() => removeFromCart(item.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              );
            })}
            <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 1 }}>
              <Typography sx={{ fontWeight: 800 }}>Total</Typography>
              <Typography sx={{ fontWeight: 800 }}>{feeRangeAmount(total)}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: chessColors.muted }}>
              Confirming adds these players to the entry list. Payment is collected by the organizer.
            </Typography>
            <Button variant="contained" onClick={confirm} sx={{ ...registerButtonSx, alignSelf: 'flex-start' }}>
              Confirm registration
            </Button>
          </Stack>
        )}
      </Container>
    </SiteShell>
  );
}

function feeRangeAmount(amount: number) {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}
