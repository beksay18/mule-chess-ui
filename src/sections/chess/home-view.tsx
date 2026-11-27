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
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Upcoming tournaments
          </Typography>
          <Button component={RouterLink} href="/tournaments">
            See all
          </Button>
        </Stack>
        <Typography sx={{ color: chessColors.muted, mb: 2 }}>
          Pick an event, choose a section, and your name goes on the entry list.
        </Typography>
        <Stack>
          {upcoming.map((tournament) => (
            <Stack
              key={tournament.id}
              component={RouterLink}
              href={`/tournaments/${tournament.slug}`}
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                py: 1.75,
                textDecoration: 'none',
                color: 'inherit',
                borderBottom: `1px solid ${chessColors.line}`,
              }}
            >
              <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
              <BoxName
                name={tournament.name}
                detail={`${tournament.organizer} · ${locationLabel(tournament)} · ${formatShortRange(tournament)}${
                  isHappening(tournament) ? ' · Happening now' : ''
                }`}
              />
            </Stack>
          ))}
        </Stack>
      </Container>
    </SiteShell>
  );
}

function BoxName({ name, detail }: { name: string; detail: string }) {
  return (
    <Stack sx={{ minWidth: 0 }}>
      <Typography sx={{ fontWeight: 700, color: chessColors.link }}>{name}</Typography>
      <Typography variant="body2" sx={{ color: chessColors.muted }}>
        {detail}
      </Typography>
    </Stack>
  );
}
