import dayjs from 'dayjs';

import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router';

import { RouterLink } from 'src/routes/components';

import { tournamentStatus } from './format';
import { SiteShell, MissingEvent, usePageTitle } from './site-shell';
import { useChessState } from './store';
import { chessColors } from './theme';

// ----------------------------------------------------------------------

export function EntryListView() {
  const { slug = '' } = useParams();
  const chess = useChessState();
  const tournament = chess.tournaments.find((item) => item.slug === slug);
  usePageTitle(tournament ? `Entry list · ${tournament.name}` : 'Entry list · Mule Chess');

  if (!tournament || tournamentStatus(tournament) === 'NEW') return <MissingEvent />;

  const entries = chess.registrations.filter((item) => item.tournamentId === tournament.id);
  const known = new Set(tournament.sections.map((section) => section.id));
  const groups = [
    ...tournament.sections.map((section) => ({
      id: section.id,
      name: section.name,
      capacity: section.capacity,
      items: entries
        .filter((item) => item.sectionId === section.id)
        .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)),
    })),
    ...[...new Set(entries.filter((item) => !known.has(item.sectionId)).map((item) => item.sectionId))].map((id) => ({
      id,
      name: entries.find((item) => item.sectionId === id)?.sectionName ?? 'Section',
      capacity: null as number | null,
      items: entries.filter((item) => item.sectionId === id),
    })),
  ];

  return (
    <SiteShell>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Entry list
        </Typography>
        <Typography sx={{ mt: 1, mb: 3 }}>
          <Link component={RouterLink} href={`/tournaments/${tournament.slug}`}>
            {tournament.name}
          </Link>
        </Typography>
        <Typography sx={{ color: chessColors.muted, mb: 3 }}>
          {entries.length} player{entries.length === 1 ? '' : 's'} registered
        </Typography>

        {entries.length === 0 && (
          <Typography>No players have registered yet.</Typography>
        )}

        <Stack spacing={3}>
          {groups.map((group) => (
            <Stack key={group.id} spacing={1}>
              <Typography sx={{ fontWeight: 800 }}>
                {group.name}
                {group.capacity !== null ? ` · ${group.items.length} / ${group.capacity}` : ''}
              </Typography>
              {group.items.length === 0 ? (
                <Typography variant="body2" sx={{ color: chessColors.muted }}>
                  No entries yet.
                </Typography>
              ) : (
                group.items.map((item) => (
                  <Stack
                    key={item.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{
                      justifyContent: 'space-between',
                      gap: 1,
                      py: 1,
                      borderBottom: `1px solid ${chessColors.line}`,
                    }}
                  >
                    <Typography>
                      {item.lastName}, {item.firstName}
                    </Typography>
                    <Typography sx={{ color: chessColors.muted }}>
                      {item.rating || 'Unrated'} · {dayjs(item.createdAt).format('MMM D, YYYY')}
                    </Typography>
                  </Stack>
                ))
              )}
            </Stack>
          ))}
        </Stack>
      </Container>
    </SiteShell>
  );
}
