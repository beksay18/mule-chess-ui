import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { useParams } from 'react-router';

import { RouterLink } from 'src/routes/components';

import { tournamentStatus, sectionTimeControlLabel } from './format';
import { SiteShell, MissingEvent, usePageTitle } from './site-shell';
import { useChessState } from './store';

// ----------------------------------------------------------------------

const NAVY = '#12325f';

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
      detail: sectionTimeControlLabel(section),
      capacity: section.capacity,
      items: entries
        .filter((item) => item.sectionId === section.id)
        .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)),
    })),
    ...[...new Set(entries.filter((item) => !known.has(item.sectionId)).map((item) => item.sectionId))].map((id) => ({
      id,
      name: entries.find((item) => item.sectionId === id)?.sectionName ?? 'Section',
      detail: '',
      capacity: null as number | null,
      items: entries.filter((item) => item.sectionId === id),
    })),
  ];

  return (
    <SiteShell>
      <Box sx={{ bgcolor: '#f6f8fb', borderTop: `1px solid ${alpha(NAVY, 0.06)}`, minHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100dvh - 72px)' } }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography sx={{ color: '#2888A0', fontWeight: 800, fontSize: 13, letterSpacing: 1.4, textTransform: 'uppercase' }}>
            Players
          </Typography>
          <Typography component="h1" sx={{ mt: 0.75, color: NAVY, fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-0.03em' }}>
            Entry list
          </Typography>
          <Link component={RouterLink} href={`/tournaments/${tournament.slug}`} sx={{ display: 'inline-block', mt: 1, color: '#175195', fontWeight: 700, fontSize: '1.1rem' }}>
            {tournament.name}
          </Link>
          <Typography sx={{ mt: 1, mb: 3.5, color: alpha(NAVY, 0.65), fontSize: '1.05rem' }}>
            {entries.length} player{entries.length === 1 ? '' : 's'} registered
          </Typography>

          <Stack spacing={2}>
            {groups.map((group) => {
              const full = group.capacity !== null && group.items.length >= group.capacity;
              return (
                <Box
                  key={group.id}
                  sx={{
                    bgcolor: '#fff',
                    border: `1px solid ${alpha(NAVY, 0.08)}`,
                    borderRadius: 3,
                    boxShadow: `0 8px 24px ${alpha(NAVY, 0.04)}`,
                    p: { xs: 2.25, md: 3 },
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: '1.25rem' }}>{group.name}</Typography>
                      {group.detail && (
                        <Typography variant="body2" sx={{ color: alpha(NAVY, 0.6) }}>{group.detail}</Typography>
                      )}
                    </Box>
                    {group.capacity !== null && (
                      <Typography sx={{ color: full ? 'error.main' : '#175195', fontWeight: 800, fontSize: '1.15rem', flexShrink: 0 }}>
                        {group.items.length} / {group.capacity}
                      </Typography>
                    )}
                  </Stack>

                  {group.items.length === 0 ? (
                    <Typography sx={{ mt: 2, color: alpha(NAVY, 0.55), fontSize: 16 }}>No entries yet.</Typography>
                  ) : (
                    <Stack spacing={1.25} sx={{ mt: 2 }}>
                      {group.items.map((item) => (
                        <Stack
                          key={item.id}
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={0.5}
                          sx={{
                            justifyContent: 'space-between',
                            alignItems: { sm: 'center' },
                            px: 2,
                            py: 1.75,
                            borderRadius: 2,
                            bgcolor: '#f7f9fc',
                          }}
                        >
                          <Typography sx={{ color: NAVY, fontWeight: 700, fontSize: '1.05rem' }}>
                            {item.lastName}, {item.firstName}
                          </Typography>
                          <Typography sx={{ color: alpha(NAVY, 0.6), flexShrink: 0, fontSize: '0.95rem' }}>
                            {item.rating || 'Unrated'} · {dayjs(item.createdAt).format('MMM D, YYYY')}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Container>
      </Box>
    </SiteShell>
  );
}
