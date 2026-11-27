import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { DateBadge } from './date-badge';
import { isPast, locationLabel, formatShortRange } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import { useChessState } from './store';
import { chessColors, entryButtonSx } from './theme';

// ----------------------------------------------------------------------

export function PastEventsView() {
  usePageTitle('Past events · Mule Chess');
  const chess = useChessState();
  const past = chess.tournaments
    .filter((tournament) => isPast(tournament))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <SiteShell>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Past events
        </Typography>
        {past.length === 0 && <Typography sx={{ color: chessColors.muted }}>No past events yet.</Typography>}
        {past.map((tournament) => {
          const hasResults = chess.results.some((result) => result.tournamentId === tournament.id);
          return (
            <Box
              key={tournament.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '72px minmax(0, 1fr)', md: '76px minmax(0, 1fr) auto' },
                gap: 2,
                alignItems: 'center',
                py: 2,
                borderBottom: `1px solid ${chessColors.line}`,
              }}
            >
              <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
              <Box>
                <Typography
                  component={RouterLink}
                  href={`/tournaments/${tournament.slug}`}
                  sx={{ fontWeight: 700, color: chessColors.link, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {tournament.name}
                </Typography>
                <Typography variant="body2" sx={{ color: chessColors.muted }}>
                  {tournament.organizer} · {locationLabel(tournament)} · {formatShortRange(tournament)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ gridColumn: { xs: '2', md: 'auto' } }}>
                <Button component={RouterLink} href={`/entry-list/${tournament.slug}`} variant="outlined" sx={entryButtonSx}>
                  Entry List
                </Button>
                {hasResults && (
                  <Button component={RouterLink} href="/results" variant="outlined" sx={entryButtonSx}>
                    Results
                  </Button>
                )}
              </Stack>
            </Box>
          );
        })}
      </Container>
    </SiteShell>
  );
}
