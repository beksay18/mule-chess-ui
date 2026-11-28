import { useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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

import { toEditorHtml, looksLikeHtml, sanitizeArticleHtml } from 'src/sections/blog/article-html';
import { articleBodySx } from 'src/sections/blog/description-editor';
import { RouterLink } from 'src/routes/components';
import { useParams } from 'react-router';

import { listTournamentTypes } from 'src/api/tournament/tournament.api';
import type { TournamentTypeOption } from 'src/api/tournament/tournament.api';

import { DateBadge } from './date-badge';
import {
  money,
  isPublic,
  feeRange,
  monthKey,
  activeFee,
  monthLabel,
  formatRange,
  isHappening,
  matchesWhen,
  isSwissFormat,
  withEntryFees,
  locationLabel,
  ENTRY_FEE_FORM,
  formatShortRange,
  registrationNote,
  tournamentStatus,
  entryDeadlineLabel,
  isRegistrationOpen,
  sectionTimeControlLabel,
} from './format';
import { SiteShell, MissingEvent, usePageTitle } from './site-shell';
import { takenSeats, useChessState } from './store';
import { chessColors, entryButtonSx, registerButtonSx } from './theme';

import type { Tournament } from './types';

// ----------------------------------------------------------------------

const NAVY = '#12325f';
const MARK = '#2888A0';

function formatLabel(types: TournamentTypeOption[], value?: string) {
  return types.find((item) => item.code === value)?.label || '';
}

const filterFieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f7f9fc',
    borderRadius: 2,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(NAVY, 0.1),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha('#175195', 0.45),
  },
};

function FilterField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <Box>
      <Typography sx={{ mb: 0.6, color: alpha(NAVY, 0.5), fontSize: 11, fontWeight: 800, letterSpacing: 0.6 }}>
        {label}
      </Typography>
      <TextField
        select
        fullWidth
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{ select: { displayEmpty: true } }}
        sx={filterFieldSx}
      >
        {children}
      </TextField>
    </Box>
  );
}

export function TournamentsView() {
  usePageTitle('Upcoming Chess Tournaments · Mule Chess');
  const chess = useChessState();
  const [tournamentTypes, setTournamentTypes] = useState<TournamentTypeOption[]>([]);
  const [query, setQuery] = useState('');
  const [when, setWhen] = useState('any');
  const [stateCode, setStateCode] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [format, setFormat] = useState('');

  useEffect(() => {
    listTournamentTypes().then(setTournamentTypes).catch(() => undefined);
  }, []);
  const [sort, setSort] = useState<'date' | 'organizer'>('date');

  const listed = chess.tournaments.filter((tournament) => isPublic(tournament));
  const states = [...new Set(listed.map((tournament) => tournament.state))].sort();
  const organizers = [...new Set(listed.map((tournament) => tournament.organizer))].sort();
  const months = [...new Set(listed.flatMap((tournament) => [monthKey(tournament.startDate), monthKey(tournament.endDate)]))].sort();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = listed.filter((tournament) => {
      const haystack = `${tournament.name} ${tournament.organizer} ${tournament.street || ''} ${tournament.city} ${tournament.state}`.toLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (stateCode && tournament.state !== stateCode) return false;
      if (organizer && tournament.organizer !== organizer) return false;
      if (format && tournament.format !== format) return false;
      return matchesWhen(tournament, when);
    });
    next.sort((a, b) => {
      if (sort === 'organizer') {
        return a.organizer.localeCompare(b.organizer) || a.startDate.localeCompare(b.startDate);
      }
      return a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name);
    });
    return next;
  }, [format, listed, organizer, query, sort, stateCode, when]);

  const happening = filtered.filter((tournament) => isHappening(tournament));
  const upcoming = filtered.filter((tournament) => !isHappening(tournament));
  const filtersActive = Boolean(query || stateCode || organizer || format || when !== 'any');

  const clearFilters = () => {
    setQuery('');
    setWhen('any');
    setStateCode('');
    setOrganizer('');
    setFormat('');
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
              Open and team events. Pick a section and join as a player.
            </Typography>
          </Stack>

          <Box
            sx={{
              bgcolor: '#fff',
              border: `1px solid ${alpha(NAVY, 0.08)}`,
              borderRadius: 3,
              boxShadow: `0 8px 24px ${alpha(NAVY, 0.04)}`,
              p: { xs: 1.5, md: 2 },
              mb: 2.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, street, city, or organizer"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              sx={filterFieldSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#175195', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                mt: 1.75,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              }}
            >
              <FilterField label="When" value={when} onChange={setWhen}>
                <MenuItem value="any">Any time</MenuItem>
                <MenuItem value="weekend">This weekend</MenuItem>
                <MenuItem value="7">Next 7 days</MenuItem>
                <MenuItem value="30">Next 30 days</MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {monthLabel(month)}
                  </MenuItem>
                ))}
              </FilterField>
              <FilterField label="State" value={stateCode} onChange={setStateCode}>
                <MenuItem value="">All states</MenuItem>
                {states.map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </FilterField>
              <FilterField label="Organizer" value={organizer} onChange={setOrganizer}>
                <MenuItem value="">All organizers</MenuItem>
                {organizers.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </FilterField>
              <FilterField label="Tournament type" value={format} onChange={setFormat}>
                <MenuItem value="">All types</MenuItem>
                {tournamentTypes.map((item) => (
                  <MenuItem key={item.code} value={item.code}>
                    {item.label}
                  </MenuItem>
                ))}
              </FilterField>
            </Box>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}>
            <Typography sx={{ color: NAVY, fontWeight: 700 }}>
              {filtered.length} upcoming tournament{filtered.length === 1 ? '' : 's'}
              {filtersActive && (
                <Button onClick={clearFilters} sx={{ ml: 1.5, minWidth: 0, p: 0, textTransform: 'none', fontWeight: 700, color: MARK }}>
                  Clear filters
                </Button>
              )}
            </Typography>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ p: 0.5, borderRadius: 2, bgcolor: '#fff', border: `1px solid ${alpha(NAVY, 0.08)}` }}
            >
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
                      borderRadius: 1.5,
                      px: 1.5,
                      color: active ? '#fff' : NAVY,
                      bgcolor: active ? '#175195' : 'transparent',
                      '&:hover': { bgcolor: active ? '#124578' : alpha(NAVY, 0.06) },
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
              typeLabel={(value) => formatLabel(tournamentTypes, value)}
            />
          )}
          {upcoming.length > 0 && (
            <TournamentGroup
              title={happening.length ? 'Coming up' : ''}
              tournaments={upcoming}
              typeLabel={(value) => formatLabel(tournamentTypes, value)}
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
  typeLabel,
}: {
  title: string;
  tournaments: Tournament[];
  typeLabel: (format?: string) => string;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography sx={{ color: MARK, fontWeight: 800, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', mb: 1.25 }}>
          {title}
        </Typography>
      )}
      <Stack spacing={1.5}>
        {tournaments.map((tournament) => (
          <TournamentRow key={tournament.id} tournament={tournament} typeLabel={typeLabel(tournament.format)} />
        ))}
      </Stack>
    </Box>
  );
}

function TournamentRow({
  tournament,
  typeLabel,
}: {
  tournament: Tournament;
  typeLabel: string;
}) {
  const open = isRegistrationOpen(tournament);
  const note = registrationNote(tournament);
  const live = isHappening(tournament);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        bgcolor: '#fff',
        borderRadius: 3,
        border: `1px solid ${alpha(NAVY, 0.08)}`,
        boxShadow: `0 8px 24px ${alpha(NAVY, 0.04)}`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 14px 32px ${alpha(NAVY, 0.08)}` },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              component={RouterLink}
              href={`/tournaments/${tournament.slug}`}
              sx={{ color: NAVY, fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em', textDecoration: 'none', '&:hover': { color: '#175195' } }}
            >
              {tournament.name}
            </Typography>
            {typeLabel && <MetaChip>{typeLabel}</MetaChip>}
            {live && (
              <Box sx={{ px: 0.9, py: 0.15, borderRadius: 5, bgcolor: alpha(MARK, 0.14), color: MARK, fontSize: 11, fontWeight: 800 }}>
                Happening now
              </Box>
            )}
          </Stack>
          <Typography sx={{ color: NAVY, fontWeight: 700, fontSize: 14, mt: 0.6 }}>{tournament.organizer}</Typography>
          <Typography variant="body2" sx={{ color: chessColors.muted, mt: 0.2 }}>
            {locationLabel(tournament)}
          </Typography>
          <Typography variant="body2" sx={{ color: chessColors.muted }}>
            {formatShortRange(tournament)}
          </Typography>
        </Box>
      </Stack>

      {tournament.sections.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ color: MARK, fontWeight: 800, fontSize: 11, letterSpacing: 1.1, mb: 0.75 }}>
            SECTIONS
          </Typography>
          <Stack spacing={0.75}>
            {tournament.sections.map((section) => (
              <Stack
                key={section.id}
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 1.25,
                  py: 0.9,
                  borderRadius: 1.5,
                  bgcolor: '#f6f8fb',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: NAVY, fontWeight: 700, fontSize: 14 }}>{section.name}</Typography>
                  <Typography variant="body2" sx={{ color: chessColors.muted }}>
                    {[
                      isSwissFormat(tournament.format) && section.rounds ? `${section.rounds} rounds` : '',
                      sectionTimeControlLabel(section),
                    ].filter(Boolean).join(' · ')}
                  </Typography>
                </Box>
                <Typography sx={{ color: NAVY, fontWeight: 800, flexShrink: 0 }}>{money(activeFee(section))}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          mt: 2,
          pt: 1.75,
          borderTop: `1px solid ${alpha(NAVY, 0.08)}`,
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {note && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: note.includes('closed') ? 'error.main' : '#8a6200' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{note}</Typography>
            </Stack>
          )}
        </Box>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', flexShrink: 0 }}>
          <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: '1.05rem', mr: 0.5 }}>{feeRange(tournament)}</Typography>
          {open ? (
            <Button component={RouterLink} href={`/register/${tournament.slug}`} variant="contained" sx={{ ...registerButtonSx, borderRadius: 2, textTransform: 'none' }}>
              Join
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
  const [tournamentTypes, setTournamentTypes] = useState<TournamentTypeOption[]>([]);
  const tournament = chess.tournaments.find((item) => item.slug === slug);
  usePageTitle(tournament ? `${tournament.name} · Mule Chess` : 'Tournament · Mule Chess');

  useEffect(() => {
    listTournamentTypes().then(setTournamentTypes).catch(() => undefined);
  }, []);

  if (!tournament || tournamentStatus(tournament) === 'NEW') return <MissingEvent />;

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
          {formatLabel(tournamentTypes, tournament.format) && (
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2.5 }}>
              <MetaChip>{formatLabel(tournamentTypes, tournament.format)}</MetaChip>
            </Stack>
          )}

          <Box
            sx={{ bgcolor: '#fff', borderRadius: 3, border: `1px solid ${alpha(NAVY, 0.08)}`, p: { xs: 2, md: 3 }, mb: 2, color: alpha(NAVY, 0.88), ...articleBodySx }}
            dangerouslySetInnerHTML={{
              __html: sanitizeArticleHtml(
                looksLikeHtml(tournament.description) ? tournament.description : toEditorHtml(tournament.description)
              ),
            }}
          />

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
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: NAVY }}>
                      {section.name}
                      {isSwissFormat(tournament.format) && section.rounds ? ` · ${section.rounds} rounds` : ''}
                      {sectionTimeControlLabel(section) ? ` · ${sectionTimeControlLabel(section)}` : ''}
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(auto-fit, minmax(170px, 1fr))' },
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {ENTRY_FEE_FORM.filter((item) => withEntryFees(section)[item.enabled]).map((item) => {
                        const priced = withEntryFees(section);
                        return (
                          <Box key={item.key}>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: NAVY }}>
                              {item.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: NAVY }}>
                              {money(priced[item.fee] ?? 0)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: alpha(NAVY, 0.65) }}>
                              {entryDeadlineLabel(priced[item.deadline], priced[item.time]) || 'Deadline not set'}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                  <Typography sx={{ color: full ? 'error.main' : alpha(NAVY, 0.75), fontWeight: 600 }}>
                    {money(activeFee(section))} now · {full ? 'Full' : `${left} open`}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1}>
            {open && (
              <Button component={RouterLink} href={`/register/${tournament.slug}`} variant="contained" sx={{ ...registerButtonSx, borderRadius: 2, textTransform: 'none' }}>
                Join
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
