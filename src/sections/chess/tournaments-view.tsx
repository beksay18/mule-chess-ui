import { useMemo, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

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

const NAVY = '#12325f';
const MARK = '#2888A0';

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
  const filtersActive = Boolean(query || stateCode || organizer || timeControl || audiences.length || when !== 'any');

  const toggleAudience = (tag: AudienceTag) => {
    setAudiences((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  const clearFilters = () => {
    setQuery('');
    setWhen('any');
    setStateCode('');
    setOrganizer('');
    setTimeControl('');
    setAudiences([]);
  };

  return (
    <SiteShell>
      <Box sx={{ bgcolor: '#f6f8fb', borderTop: `1px solid ${alpha(NAVY, 0.06)}` }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack spacing={1} sx={{ mb: 3, maxWidth: 640 }}>
            <Typography sx={{ color: MARK, fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase' }}>
              Chess tournaments
            </Typography>
            <Typography component="h1" sx={{ color: NAVY, fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.35rem' }, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Find a tournament
            </Typography>
            <Typography sx={{ color: alpha(NAVY, 0.7), fontSize: '1.02rem', lineHeight: 1.6 }}>
              Open, scholastic, and team events. Pick a section and reserve your seat.
            </Typography>
          </Stack>

          <Box
            sx={{
              bgcolor: '#fff',
              border: `1px solid ${alpha(MARK, 0.22)}`,
              borderRadius: 3,
              p: { xs: 2, md: 2.5 },
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr 0.8fr' },
              }}
            >
              <TextField
                size="small"
                placeholder="Search by name, city, or organizer"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: MARK, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
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
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mt: 1.5, alignItems: { md: 'center' } }}>
              <TextField
                select
                size="small"
                label="Organizer"
                value={organizer}
                onChange={(event) => setOrganizer(event.target.value)}
                sx={{ minWidth: { md: 220 } }}
              >
                <MenuItem value="">All organizers</MenuItem>
                {organizers.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                label="Time control"
                value={timeControl}
                onChange={(event) => setTimeControl(event.target.value)}
                sx={{ minWidth: { md: 200 } }}
              >
                {TIME_CONTROLS.map((item) => (
                  <MenuItem key={item.label} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 1.75 }}>
              {AUDIENCE_FILTERS.map((item) => {
                const selected = audiences.includes(item.id);
                return (
                  <Button
                    key={item.id}
                    size="small"
                    onClick={() => toggleAudience(item.id)}
                    sx={{
                      borderRadius: 5,
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 1.5,
                      color: selected ? '#fff' : NAVY,
                      bgcolor: selected ? MARK : '#fff',
                      border: `1px solid ${selected ? MARK : alpha(MARK, 0.35)}`,
                      '&:hover': { bgcolor: selected ? '#217890' : alpha(MARK, 0.08) },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}>
            <Typography sx={{ color: alpha(NAVY, 0.7), fontWeight: 600 }}>
              {filtered.length} upcoming tournament{filtered.length === 1 ? '' : 's'}
              {filtersActive && (
                <Button onClick={clearFilters} sx={{ ml: 1, minWidth: 0, p: 0, textTransform: 'none', fontWeight: 700, color: MARK }}>
                  Clear filters
                </Button>
              )}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {([
                ['date', 'By date'],
                ['organizer', 'By organizer'],
              ] as const).map(([value, label]) => {
                const active = sort === value;
                return (
                  <Button
                    key={value}
                    size="small"
                    onClick={() => setSort(value)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 5,
                      color: active ? '#fff' : NAVY,
                      bgcolor: active ? NAVY : 'transparent',
                      '&:hover': { bgcolor: active ? NAVY : alpha(NAVY, 0.06) },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
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
              title={happening.length ? 'Coming up' : 'Upcoming'}
              tournaments={upcoming}
              openSections={openSections}
              onToggleSections={setOpenSections}
            />
          )}
          {filtered.length === 0 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography sx={{ color: NAVY, fontWeight: 800, mb: 0.5 }}>No tournaments match those filters.</Typography>
              <Button onClick={clearFilters} sx={{ textTransform: 'none', fontWeight: 700, color: MARK }}>
                Clear filters
              </Button>
            </Box>
          )}
        </Container>
      </Box>
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
    <Box sx={{ mt: 1, mb: 3 }}>
      <Typography sx={{ color: MARK, fontWeight: 800, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', mb: 1.25 }}>
        {title}
      </Typography>
      <Stack spacing={1.25}>
        {tournaments.map((tournament) => (
          <TournamentRow
            key={tournament.id}
            tournament={tournament}
            sectionsOpen={openSections === tournament.id}
            onToggleSections={() => onToggleSections(openSections === tournament.id ? null : tournament.id)}
          />
        ))}
      </Stack>
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
  const live = isHappening(tournament);

  return (
    <Box
      sx={{
        p: { xs: 1.75, md: 2 },
        bgcolor: '#fff',
        borderRadius: 3,
        border: `1px solid ${alpha(NAVY, 0.08)}`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 28px ${alpha(NAVY, 0.08)}` },
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
        <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              component={RouterLink}
              href={`/tournaments/${tournament.slug}`}
              sx={{ color: NAVY, fontWeight: 800, textDecoration: 'none', '&:hover': { color: MARK } }}
            >
              {tournament.name}
            </Typography>
            {live && (
              <Box sx={{ px: 0.9, py: 0.15, borderRadius: 5, bgcolor: alpha(MARK, 0.14), color: MARK, fontSize: 11, fontWeight: 800 }}>
                Happening now
              </Box>
            )}
          </Stack>
          <Typography variant="body2" sx={{ color: chessColors.muted, mt: 0.35 }}>
            {tournament.organizer} · {locationLabel(tournament)} · {formatShortRange(tournament)}
          </Typography>
          <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', mt: 0.9 }}>
            <MetaChip>{timeControlLabel(tournament.timeControl)}</MetaChip>
            {tournament.audiences.map((tag) => (
              <MetaChip key={tag}>{audienceLabel(tag)}</MetaChip>
            ))}
          </Stack>
          {note && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.75, color: note.includes('closed') ? 'error.main' : '#8a6200' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{note}</Typography>
            </Stack>
          )}
          {tournament.sections.length > 1 && (
            <Button size="small" onClick={onToggleSections} sx={{ px: 0, minWidth: 0, mt: 0.25, textTransform: 'none', fontWeight: 700, color: MARK }}>
              {sectionsOpen ? 'Hide sections' : `${tournament.sections.length} sections`}
            </Button>
          )}
          {sectionsOpen && (
            <Stack spacing={0.25} sx={{ mt: 0.5 }}>
              {tournament.sections.map((section) => (
                <Typography key={section.id} variant="body2" sx={{ color: alpha(NAVY, 0.8) }}>
                  {section.name} — {money(section.fee)}
                </Typography>
              ))}
            </Stack>
          )}
        </Box>
        <Stack
          direction={{ xs: 'row', md: 'column' }}
          spacing={1}
          sx={{ alignItems: { xs: 'center', md: 'flex-end' }, justifyContent: 'space-between', minWidth: { md: 132 } }}
        >
          <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '1.05rem' }}>{feeRange(tournament)}</Typography>
          <Stack direction="row" spacing={0.5}>
            {open ? (
              <Button component={RouterLink} href={`/register/${tournament.slug}`} variant="contained" sx={{ ...registerButtonSx, borderRadius: 2, textTransform: 'none' }}>
                Register
              </Button>
            ) : (
              <Button variant="contained" disabled sx={{ textTransform: 'none' }}>
                Closed
              </Button>
            )}
            <Button component={RouterLink} href={`/entry-list/${tournament.slug}`} variant="outlined" sx={{ ...entryButtonSx, borderRadius: 2, textTransform: 'none' }}>
              Entry list
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

function MetaChip({ children }: { children: string }) {
  return (
    <Box
      sx={{
        px: 0.9,
        py: 0.15,
        borderRadius: 1,
        border: `1px solid ${alpha(MARK, 0.35)}`,
        color: MARK,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
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
      <Box sx={{ bgcolor: '#f6f8fb', borderTop: `1px solid ${alpha(NAVY, 0.06)}` }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <Button component={RouterLink} href="/tournaments" sx={{ mb: 2, px: 0, minWidth: 0, textTransform: 'none', fontWeight: 700, color: MARK }}>
            All tournaments
          </Button>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, mb: 2 }}>
            <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
            <Box>
              <Typography component="h1" sx={{ color: NAVY, fontWeight: 800, fontSize: { xs: '1.7rem', md: '2.1rem' }, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                {tournament.name}
              </Typography>
              <Typography sx={{ mt: 0.75, color: alpha(NAVY, 0.7) }}>
                {formatRange(tournament)} · {locationLabel(tournament)} · {tournament.organizer}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2.5 }}>
            <MetaChip>{timeControlLabel(tournament.timeControl)}</MetaChip>
            {tournament.audiences.map((tag) => (
              <MetaChip key={tag}>{audienceLabel(tag)}</MetaChip>
            ))}
          </Stack>

          <Box sx={{ bgcolor: '#fff', borderRadius: 3, border: `1px solid ${alpha(NAVY, 0.08)}`, p: { xs: 2, md: 3 }, mb: 2 }}>
            <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: alpha(NAVY, 0.88) }}>{tournament.description}</Typography>
            {tournament.prizeSummary && (
              <Typography sx={{ mt: 2, fontWeight: 700, color: NAVY }}>{tournament.prizeSummary}</Typography>
            )}
          </Box>

          <Typography sx={{ color: MARK, fontWeight: 800, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', mb: 1.25 }}>
            Sections
          </Typography>
          <Stack spacing={1} sx={{ mb: 3 }}>
            {tournament.sections.map((section) => {
              const taken = takenSeats(chess, tournament.id, section.id);
              const full = taken >= section.capacity;
              const left = section.capacity - taken;
              return (
                <Stack
                  key={section.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    justifyContent: 'space-between',
                    gap: 1,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    border: `1px solid ${alpha(NAVY, 0.08)}`,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: NAVY }}>{section.name}</Typography>
                  <Typography sx={{ color: full ? 'error.main' : alpha(NAVY, 0.75), fontWeight: 600 }}>
                    {money(section.fee)} · {full ? 'Full' : `${left} open`}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1}>
            {open && (
              <Button component={RouterLink} href={`/register/${tournament.slug}`} variant="contained" sx={{ ...registerButtonSx, borderRadius: 2, textTransform: 'none' }}>
                Register
              </Button>
            )}
            <Button component={RouterLink} href={`/entry-list/${tournament.slug}`} variant="outlined" sx={{ ...entryButtonSx, borderRadius: 2, textTransform: 'none' }}>
              Entry list
            </Button>
          </Stack>
        </Container>
      </Box>
    </SiteShell>
  );
}
