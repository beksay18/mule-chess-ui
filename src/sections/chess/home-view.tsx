import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { DateBadge } from './date-badge';
import { isPast, isHappening, locationLabel, formatShortRange } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import { useChessState } from './store';
import { chessColors } from './theme';

// ----------------------------------------------------------------------

const steps = [
  { title: 'Create an account', text: 'Log in once, then every entry is under your name.' },
  { title: 'Choose a section', text: 'Open, scholastic, and team sections each have their own fee and capacity.' },
  { title: 'Show up on the list', text: 'Confirming the cart adds the player to the entry list.' },
];

export function HomeView() {
  usePageTitle('Mule Chess');
  const chess = useChessState();
  const upcoming = chess.tournaments
    .filter((tournament) => !isPast(tournament))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);

  return (
    <SiteShell variant="home">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 5,
          }}
        >
          {steps.map((step, index) => (
            <Box key={step.title} sx={{ bgcolor: '#fff', borderRadius: 3, p: 2.5, border: `1px solid ${chessColors.line}` }}>
              <Typography sx={{ color: chessColors.green, fontWeight: 800, fontSize: 13, letterSpacing: 0.6 }}>
                0{index + 1}
              </Typography>
              <Typography sx={{ fontWeight: 800, mt: 0.5, mb: 0.5 }}>{step.title}</Typography>
              <Typography variant="body2" sx={{ color: chessColors.muted }}>
                {step.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Upcoming tournaments
          </Typography>
          <Button component={RouterLink} href="/tournaments">
            See all
          </Button>
        </Stack>
        <Stack spacing={1.5}>
          {upcoming.map((tournament) => (
            <Stack
              key={tournament.id}
              component={RouterLink}
              href={`/tournaments/${tournament.slug}`}
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                p: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                bgcolor: '#fff',
                borderRadius: 3,
                border: `1px solid ${chessColors.line}`,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 28px rgba(20, 40, 32, 0.08)' },
              }}
            >
              <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
              <Stack sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: chessColors.ink }}>{tournament.name}</Typography>
                <Typography variant="body2" sx={{ color: chessColors.muted }}>
                  {tournament.organizer} · {locationLabel(tournament)} · {formatShortRange(tournament)}
                  {isHappening(tournament) ? ' · Happening now' : ''}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Container>
    </SiteShell>
  );
}
