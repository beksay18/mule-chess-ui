import { useMemo, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { useParams } from 'react-router';

import { DateBadge } from './date-badge';
import {
  money,
  isPast,
  feeRange,
  monthKey,
  monthLabel,
  formatRange,
  isHappening,
  matchesWhen,
  TIME_CONTROLS,
  audienceLabel,
  locationLabel,
  AUDIENCE_FILTERS,
  formatShortRange,
  registrationNote,
  timeControlLabel,
  isRegistrationOpen,
} from './format';
import { SiteShell, MissingEvent, usePageTitle } from './site-shell';
import { takenSeats, useChessState } from './store';
import { chessColors, entryButtonSx, registerButtonSx } from './theme';

import type { Tournament, AudienceTag } from './types';

// ----------------------------------------------------------------------

export function TournamentsView() {
  usePageTitle('Upcoming Chess Tournaments · Mule Chess');
  const chess = useChessState();
  const [query, setQuery] = useState('');
  const [when, setWhen] = useState('any');
  const [stateCode, setStateCode] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [timeControl, setTimeControl] = useState('');
  const [audiences, setAudiences] = useState<AudienceTag[]>([]);
  const [sort, setSort] = useState<'date' | 'organizer'>('date');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [openSections, setOpenSections] = useState<string | null>(null);

  const listed = chess.tournaments.filter((tournament) => !isPast(tournament));
  const states = [...new Set(listed.map((tournament) => tournament.state))].sort();
  const organizers = [...new Set(listed.map((tournament) => tournament.organizer))].sort();
  const months = [...new Set(listed.flatMap((tournament) => [monthKey(tournament.startDate), monthKey(tournament.endDate)]))].sort();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = listed.filter((tournament) => {
      const haystack = `${tournament.name} ${tournament.organizer} ${tournament.city} ${tournament.state}`.toLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (stateCode && tournament.state !== stateCode) return false;
      if (organizer && tournament.organizer !== organizer) return false;
      if (timeControl && tournament.timeControl !== timeControl) return false;
      if (audiences.length && !audiences.some((tag) => tournament.audiences.includes(tag))) return false;
      return matchesWhen(tournament, when);
    });
    next.sort((a, b) => {
      if (sort === 'organizer') {
        return a.organizer.localeCompare(b.organizer) || a.startDate.localeCompare(b.startDate);
      }
      return a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name);
    });
    return next;
  }, [audiences, listed, organizer, query, sort, stateCode, timeControl, when]);

  const happening = filtered.filter((tournament) => isHappening(tournament));
  const upcoming = filtered.filter((tournament) => !isHappening(tournament));

  const toggleAudience = (tag: AudienceTag) => {
    setAudiences((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  return (
    <SiteShell>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Upcoming Tournaments
        </Typography>

        <Box sx={{ bgcolor: '#fff', border: `1px solid ${chessColors.line}`, borderRadius: 3, mb: 2.5, overflow: 'hidden' }}>
          <Button fullWidth onClick={() => setFiltersOpen((open) => !open)} sx={{ justifyContent: 'space-between', color: chessColors.ink }}>
            Search and filters
            <span>{filtersOpen ? '▴' : '▾'}</span>
          </Button>
          {filtersOpen && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr 0.8fr 1fr' },
                }}
              >
                <TextField
                  size="small"
                  label="Search"
                  placeholder="Tournament, organizer, city or state"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <TextField select size="small" label="When" value={when} onChange={(event) => setWhen(event.target.value)}>
                  <MenuItem value="any">Any time</MenuItem>
                  <MenuItem value="weekend">This weekend</MenuItem>
                  <MenuItem value="7">Next 7 days</MenuItem>
                  <MenuItem value="30">Next 30 days</MenuItem>
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {monthLabel(month)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select size="small" label="State" value={stateCode} onChange={(event) => setStateCode(event.target.value)}>
                  <MenuItem value="">All states</MenuItem>
                  {states.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select size="small" label="Organizer" value={organizer} onChange={(event) => setOrganizer(event.target.value)}>
                  <MenuItem value="">All organizers</MenuItem>
                  {organizers.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2, alignItems: { sm: 'center' } }}>
                <TextField
                  select
                  size="small"
                  label="Time control"
                  value={timeControl}
                  onChange={(event) => setTimeControl(event.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  {TIME_CONTROLS.map((item) => (
                    <MenuItem key={item.label} value={item.id}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {AUDIENCE_FILTERS.map((item) => {
                    const selected = audiences.includes(item.id);
                    return (
                      <Button
                        key={item.id}
                        size="small"
                        variant={selected ? 'contained' : 'outlined'}
                        onClick={() => toggleAudience(item.id)}
                        sx={{ borderRadius: 5 }}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ color: chessColors.muted }}>
            {filtered.length} upcoming tournament{filtered.length === 1 ? '' : 's'}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant={sort === 'date' ? 'contained' : 'outlined'} onClick={() => setSort('date')}>
              By date
            </Button>
            <Button size="small" variant={sort === 'organizer' ? 'contained' : 'outlined'} onClick={() => setSort('organizer')}>
              By organizer
            </Button>
          </Stack>
        </Stack>

        {happening.length > 0 && (
          <TournamentGroup
            title="Happening now"
            tournaments={happening}
            openSections={openSections}
            onToggleSections={setOpenSections}
          />
        )}
        {upcoming.length > 0 && (
          <TournamentGroup
            title={happening.length ? 'Later' : 'Upcoming'}
            tournaments={upcoming}
            openSections={openSections}
            onToggleSections={setOpenSections}
          />
        )}
        {filtered.length === 0 && (
          <Typography sx={{ py: 6, textAlign: 'center', color: chessColors.muted }}>
            No tournaments match those filters.
          </Typography>
        )}
      </Container>
    </SiteShell>
  );
}

function TournamentGroup({
  title,
  tournaments,
  openSections,
  onToggleSections,
}: {
  title: string;
  tournaments: Tournament[];
  openSections: string | null;
  onToggleSections: (id: string | null) => void;
}) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{title}</Typography>
      {tournaments.map((tournament) => (
        <TournamentRow
          key={tournament.id}
          tournament={tournament}
          sectionsOpen={openSections === tournament.id}
          onToggleSections={() => onToggleSections(openSections === tournament.id ? null : tournament.id)}
        />
      ))}
    </Box>
  );
}

function TournamentRow({
  tournament,
  sectionsOpen,
  onToggleSections,
}: {
  tournament: Tournament;
  sectionsOpen: boolean;
  onToggleSections: () => void;
}) {
  const open = isRegistrationOpen(tournament);
  const note = registrationNote(tournament);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '72px minmax(0, 1fr)', md: '76px minmax(0, 1fr) 150px auto' },
        gap: { xs: 1.5, md: 2 },
        alignItems: 'center',
        p: 2,
        mb: 1.25,
        bgcolor: '#fff',
        borderRadius: 3,
        border: `1px solid ${chessColors.line}`,
        transition: 'box-shadow 0.15s ease',
        '&:hover': { boxShadow: '0 10px 24px rgba(20, 40, 32, 0.06)' },
      }}
    >
      <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          component={RouterLink}
          href={`/tournaments/${tournament.slug}`}
          sx={{ color: chessColors.link, fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          {tournament.name}
        </Typography>
        <Typography variant="body2" sx={{ color: chessColors.muted }}>
          {tournament.organizer} · {formatShortRange(tournament)}
        </Typography>
        <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', mt: 0.75 }}>
          {tournament.audiences.map((tag) => (
            <Box
              key={tag}
              sx={{
                px: 0.75,
                borderRadius: 1,
                border: `1px solid ${chessColors.green}`,
                color: chessColors.green,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {audienceLabel(tag)}
            </Box>
          ))}
        </Stack>
        {note && (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5, color: note.includes('closed') ? 'error.main' : '#8a6200' }}>
            <AccessTimeIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{note}</Typography>
          </Stack>
        )}
        <Typography variant="body2" sx={{ display: { xs: 'block', md: 'none' }, mt: 0.5 }}>
          {locationLabel(tournament)} · {feeRange(tournament)}
        </Typography>
        {tournament.sections.length > 1 && (
          <Button size="small" onClick={onToggleSections} sx={{ px: 0, minWidth: 0 }}>
            {sectionsOpen ? 'Hide sections' : `All ${tournament.sections.length} sections`}
          </Button>
        )}
        {sectionsOpen && (
          <Stack sx={{ mt: 0.5 }}>
            {tournament.sections.map((section) => (
              <Typography key={section.id} variant="body2">
                {section.name} — {money(section.fee)}
              </Typography>
            ))}
          </Stack>
        )}
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ color: chessColors.muted }}>
          {locationLabel(tournament)}
        </Typography>
        <Typography sx={{ fontWeight: 700 }}>{feeRange(tournament)}</Typography>
      </Box>
      <Stack direction="row" spacing={1} sx={{ gridColumn: { xs: '2', md: 'auto' } }}>
        {open ? (
          <Button component={RouterLink} href={`/register/${tournament.slug}`} variant="contained" sx={registerButtonSx}>
            Register
          </Button>
        ) : (
          <Button variant="contained" disabled>
            Closed
          </Button>
        )}
        <Button component={RouterLink} href={`/entry-list/${tournament.slug}`} variant="outlined" sx={entryButtonSx}>
          Entry List
        </Button>
      </Stack>
    </Box>
  );
}

export function TournamentDetailView() {
  const { slug = '' } = useParams();
  const chess = useChessState();
  const tournament = chess.tournaments.find((item) => item.slug === slug);
  usePageTitle(tournament ? `${tournament.name} · Mule Chess` : 'Tournament · Mule Chess');

  if (!tournament) return <MissingEvent />;

  const open = isRegistrationOpen(tournament);

  return (
    <SiteShell>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {tournament.name}
        </Typography>
        <Typography sx={{ mt: 1, mb: 2, color: chessColors.muted }}>
          {formatRange(tournament)} · {locationLabel(tournament)} · {tournament.organizer}
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2 }}>
          <Chip>{timeControlLabel(tournament.timeControl)}</Chip>
          {tournament.audiences.map((tag) => (
            <Chip key={tag}>{audienceLabel(tag)}</Chip>
          ))}
        </Stack>
        <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, mb: 2 }}>{tournament.description}</Typography>
        {tournament.prizeSummary && (
          <Typography sx={{ mb: 3, fontWeight: 700 }}>{tournament.prizeSummary}</Typography>
        )}

        <Typography sx={{ fontWeight: 800, mb: 1 }}>Sections</Typography>
        <Stack spacing={1} sx={{ mb: 3 }}>
          {tournament.sections.map((section) => {
            const taken = takenSeats(chess, tournament.id, section.id);
            const full = taken >= section.capacity;
            return (
              <Stack key={section.id} direction="row" sx={{ justifyContent: 'space-between', gap: 2, borderBottom: `1px solid ${chessColors.line}`, py: 1 }}>
                <Typography>{section.name}</Typography>
                <Typography sx={{ color: full ? 'error.main' : chessColors.ink }}>
                  {money(section.fee)} · {full ? 'Full' : `${section.capacity - taken} open`}
                </Typography>
              </Stack>
            );
          })}
        </Stack>

        <Stack direction="row" spacing={1}>
          {open && (
            <Button component={RouterLink} href={`/register/${tournament.slug}`} variant="contained" sx={registerButtonSx}>
              Register
            </Button>
          )}
          <Button component={RouterLink} href={`/entry-list/${tournament.slug}`} variant="outlined" sx={entryButtonSx}>
            Entry List
          </Button>
        </Stack>
      </Container>
    </SiteShell>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 1,
        bgcolor: '#eef6ef',
        color: chessColors.green,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {children}
    </Box>
  );
}
