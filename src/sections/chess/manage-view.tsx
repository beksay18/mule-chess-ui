import { useRef, useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';

import { listTournamentTypes, createTournamentRequest, deleteTournamentRequest, updateTournamentRequest } from 'src/api/tournament/tournament.api';

import type { TournamentTypeOption } from 'src/api/tournament/tournament.api';
import { DashboardContent } from 'src/layouts/dashboard';

import { isPast, US_STATES, isHappening, TIME_CONTROLS, locationLabel, AUDIENCE_FILTERS, formatShortRange } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import {
  useChessState,
  removeRegistration,
  restoreSampleEvents,
  refreshTournamentsFromApi,
} from './store';
import { chessColors, registerButtonSx } from './theme';

import type { Tournament, AudienceTag, TimeControl, TournamentDraft, TournamentFormat, TournamentSection } from './types';

function formatLabel(types: TournamentTypeOption[], value?: string) {
  return types.find((item) => item.code === value)?.label ?? '';
}

function FormSectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontWeight: 800, color: '#12325f' }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: chessColors.muted, mt: 0.25 }}>
        {text}
      </Typography>
    </Box>
  );
}

function TournamentFormatDialog({
  open,
  types,
  value,
  onChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  types: TournamentTypeOption[];
  value: string;
  onChange: (value: TournamentFormat) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        Choose Tournament Type
        <IconButton aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" sx={{ width: '100%', mt: 0.5, px: 2, py: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <FormLabel component="legend" sx={{ px: 0.5, fontSize: 14 }}>
            Tournament type
          </FormLabel>
          <RadioGroup value={value} onChange={(event) => onChange(event.target.value as TournamentFormat)}>
            {types.map((item) => (
              <FormControlLabel key={item.code} value={item.code} control={<Radio />} label={item.label} />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<CheckIcon />}
          onClick={onConfirm}
          sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#175195', '&:hover': { bgcolor: '#124578' } }}
        >
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<CloseIcon />}
          onClick={onClose}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function blankDraft(): TournamentDraft {
  return {
    name: '',
    organizer: 'Mule Chess Club',
    city: '',
    state: 'MO',
    startDate: '',
    endDate: '',
    registrationCloses: '',
    description: '',
    timeControl: 'regular',
    format: 'swiss',
    audiences: ['adults'],
    prizeSummary: '',
    sections: [{ id: crypto.randomUUID(), name: 'Open', fee: 40, capacity: 24 }],
  };
}

function toDraft(tournament: Tournament): TournamentDraft {
  return {
    name: tournament.name,
    organizer: tournament.organizer,
    city: tournament.city,
    state: tournament.state,
    startDate: tournament.startDate,
    endDate: tournament.endDate,
    registrationCloses: tournament.registrationCloses,
    description: tournament.description,
    timeControl: tournament.timeControl,
    format: tournament.format || 'swiss',
    audiences: [...tournament.audiences],
    prizeSummary: tournament.prizeSummary,
    sections: tournament.sections.map((section) => ({ ...section })),
  };
}

function validate(draft: TournamentDraft) {
  if (!draft.name.trim()) return 'Enter a tournament name.';
  if (!draft.organizer.trim()) return 'Enter an organizer.';
  if (!draft.city.trim() || !draft.state.trim()) return 'Enter a city and state.';
  if (!draft.startDate || !draft.endDate || !draft.registrationCloses) {
    return 'Enter the start, end, and registration deadline.';
  }
  if (draft.endDate < draft.startDate) return 'The end date has to be on or after the start date.';
  if (draft.registrationCloses > draft.endDate) return 'Registration has to close on or before the last day.';
  if (!draft.description.trim()) return 'Add a short description players will read before they register.';
  if (!draft.sections.length) return 'Add at least one section.';
  if (draft.sections.some((section) => !section.name.trim())) return 'Every section needs a name.';
  if (draft.sections.some((section) => section.capacity < 1 || section.fee < 0)) {
    return 'Each section needs a fee of zero or more and room for at least one player.';
  }
  return '';
}

export function ManageView({ embedded = false }: { embedded?: boolean }) {
  usePageTitle(embedded ? 'Tournaments · Mule Chess' : 'Organize · Mule Chess');
  const chess = useChessState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TournamentDraft>(blankDraft);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [formatOpen, setFormatOpen] = useState(false);
  const [formatChoice, setFormatChoice] = useState<TournamentFormat>('swiss');
  const [tournamentTypes, setTournamentTypes] = useState<TournamentTypeOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'upcoming' | 'happening' | 'past'>('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [error]);

  useEffect(() => {
    listTournamentTypes()
      .then((rows) => {
        setTournamentTypes(rows);
        setFormatChoice((current) => (rows.some((row) => row.code === current) ? current : (rows[0]?.code as TournamentFormat) || current));
      })
      .catch(() => undefined);
  }, []);

  const tournaments = [...chess.tournaments].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const entries = chess.registrations.filter((item) => item.tournamentId === editingId);

  const patch = (partial: Partial<TournamentDraft>) => setDraft((current) => ({ ...current, ...partial }));

  const toggleAudience = (tag: AudienceTag) => {
    setDraft((current) => ({
      ...current,
      audiences: current.audiences.includes(tag)
        ? current.audiences.filter((item) => item !== tag)
        : [...current.audiences, tag],
    }));
  };

  const updateSection = (id: string, partial: Partial<TournamentSection>) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === id ? { ...section, ...partial } : section)),
    }));
  };

  const startNew = () => {
    setEditingId(null);
    setDraft(blankDraft());
    setError('');
    setNotice('');
  };

  const startEdit = (tournament: Tournament) => {
    setEditingId(tournament.id);
    setDraft(toDraft(tournament));
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const confirmFormat = () => {
    setEditingId(null);
    setDraft({ ...blankDraft(), format: formatChoice });
    setShowForm(true);
    setFormatOpen(false);
    setError('');
    setNotice('');
  };

  const save = async () => {
    const problem = validate(draft);
    if (problem) {
      setError(problem);
      setNotice('');
      return;
    }
    try {
      const saved = editingId
        ? await updateTournamentRequest(editingId, draft)
        : await createTournamentRequest(draft);
      await refreshTournamentsFromApi();
      setEditingId(saved.id);
      setDraft(toDraft(saved));
      if (embedded) setShowForm(false);
      setNotice(editingId ? 'Tournament updated.' : 'Tournament published. Players can register from the tournaments list.');
      setError('');
    } catch (saveError: any) {
      setNotice('');
      setError(saveError?.response?.data?.message || 'Could not save the tournament.');
    }
  };

  const remove = async (tournament: Tournament) => {
    if (!window.confirm(`Delete ${tournament.name}? Entries for it will be removed too.`)) return;
    try {
      await deleteTournamentRequest(tournament.id);
      await refreshTournamentsFromApi();
      if (editingId === tournament.id) startNew();
      setNotice('Tournament deleted.');
      setError('');
    } catch (deleteError: any) {
      setNotice('');
      setError(deleteError?.response?.data?.message || 'Could not delete the tournament.');
    }
  };

  const visible = tournaments.filter((tournament) => {
    if (status === 'happening' && !isHappening(tournament)) return false;
    if (status === 'past' && !isPast(tournament)) return false;
    if (status === 'upcoming' && (isPast(tournament) || isHappening(tournament))) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return `${tournament.name} ${tournament.city} ${tournament.state} ${tournament.organizer}`.toLowerCase().includes(needle);
  });
  const pageRows = visible.slice(pageIndex * rowsPerPage, pageIndex * rowsPerPage + rowsPerPage);
  const from = visible.length === 0 ? 0 : pageIndex * rowsPerPage + 1;
  const to = Math.min((pageIndex + 1) * rowsPerPage, visible.length);
  const counts = {
    all: tournaments.length,
    upcoming: tournaments.filter((tournament) => !isPast(tournament) && !isHappening(tournament)).length,
    happening: tournaments.filter((tournament) => isHappening(tournament)).length,
    past: tournaments.filter((tournament) => isPast(tournament)).length,
  };

  if (embedded && !showForm) {
    return (
      <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
        <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setFormatChoice('swiss');
              setFormatOpen(true);
            }}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#175195', '&:hover': { bgcolor: '#124578' } }}
          >
            Host New Event
          </Button>
        </Stack>
        {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Card>
          <Tabs
            value={status}
            onChange={(_event, value) => {
              setStatus(value);
              setPageIndex(0);
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab value="all" label={`All (${counts.all})`} />
            <Tab value="upcoming" label={`Upcoming (${counts.upcoming})`} />
            <Tab value="happening" label={`Happening now (${counts.happening})`} />
            <Tab value="past" label={`Past (${counts.past})`} />
          </Tabs>
          <Toolbar sx={{ gap: 1.5, py: 2, px: 3 }}>
            <OutlinedInput
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPageIndex(0);
              }}
              placeholder="Search tournament..."
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{ width: { xs: '100%', sm: 280 }, height: 40 }}
            />
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Tournament</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Tournament type</TableCell>
                  <TableCell>Entered</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {pageRows.map((tournament) => {
                  const count = chess.registrations.filter((item) => item.tournamentId === tournament.id).length;
                  return (
                    <TableRow key={tournament.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{tournament.name}</TableCell>
                      <TableCell>{formatShortRange(tournament)}</TableCell>
                      <TableCell>{locationLabel(tournament)}</TableCell>
                      <TableCell>{formatLabel(tournamentTypes, tournament.format)}</TableCell>
                      <TableCell>{count}</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => startEdit(tournament)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => remove(tournament)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                      No tournaments match.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            page={pageIndex}
            count={visible.length}
            rowsPerPage={rowsPerPage}
            onPageChange={(_event, nextPage) => setPageIndex(nextPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPageIndex(0);
            }}
            rowsPerPageOptions={[10, 20, 40]}
            labelDisplayedRows={() => `${from}-${to} of ${visible.length}`}
          />
        </Card>
        <TournamentFormatDialog
          open={formatOpen}
          types={tournamentTypes}
          value={formatChoice}
          onChange={setFormatChoice}
          onClose={() => setFormatOpen(false)}
          onConfirm={confirmFormat}
        />
      </DashboardContent>
    );
  }

  const page = (
      <Container maxWidth="lg" disableGutters={embedded} sx={{ py: embedded ? 0 : { xs: 3, md: 5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-start' }, gap: 2, mb: 2.5 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#12325f' }}>
              {embedded ? (editingId ? 'Edit tournament' : 'Host new event') : 'Organize'}
            </Typography>
            <Typography sx={{ color: chessColors.muted, mt: 0.5 }}>
              Players register from the public list after you publish.
            </Typography>
            <Chip
              size="small"
              label={formatLabel(tournamentTypes, draft.format) || 'Tournament type'}
              sx={{ mt: 1.25, fontWeight: 700, color: '#12325f', bgcolor: 'rgba(40, 136, 160, 0.14)' }}
            />
          </Box>
          {embedded ? (
            <Button
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowForm(false)}
              sx={{ textTransform: 'none', fontWeight: 700, color: '#175195' }}
            >
              Back to tournaments
            </Button>
          ) : (
            <Button variant="outlined" onClick={startNew}>
              New tournament
            </Button>
          )}
        </Stack>

        {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
        {error && <Alert ref={errorRef} severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!embedded && <Stack spacing={1} sx={{ mb: 4 }}>
          {tournaments.map((tournament) => {
            const count = chess.registrations.filter((item) => item.tournamentId === tournament.id).length;
            const selected = tournament.id === editingId;
            return (
              <Stack
                key={tournament.id}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{
                  alignItems: { sm: 'center' },
                  p: 1.5,
                  borderRadius: 1,
                  border: `1px solid ${selected ? chessColors.link : chessColors.line}`,
                  bgcolor: selected ? '#f4f8fd' : '#fff',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{tournament.name}</Typography>
                  <Typography variant="body2" sx={{ color: chessColors.muted }}>
                    {formatShortRange(tournament)} · {locationLabel(tournament)} · {count} entered
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => startEdit(tournament)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => remove(tournament)}>
                    Delete
                  </Button>
                </Stack>
              </Stack>
            );
          })}
        </Stack>}

        <Card
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#175195' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#175195' },
          }}
        >
          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="Event" text="The name players see on the public list." />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField size="small" fullWidth label="Name" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField size="small" fullWidth label="Organizer" value={draft.organizer} onChange={(event) => patch({ organizer: event.target.value })} />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="Place and dates" text="Where the games are played and when registration closes." />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8, md: 6 }}>
                <TextField size="small" fullWidth label="City" value={draft.city} onChange={(event) => patch({ city: event.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                <TextField select size="small" fullWidth label="State" value={draft.state} onChange={(event) => patch({ state: event.target.value })}>
                  {US_STATES.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Time control"
                  value={draft.timeControl}
                  onChange={(event) => patch({ timeControl: event.target.value as TimeControl })}
                >
                  {TIME_CONTROLS.filter((item) => item.id).map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Starts"
                  value={draft.startDate}
                  onChange={(event) => patch({ startDate: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Ends"
                  value={draft.endDate}
                  onChange={(event) => patch({ endDate: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  label="Registration closes"
                  value={draft.registrationCloses}
                  onChange={(event) => patch({ registrationCloses: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="Who can play" text="Choose every group this event is open to." />
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {AUDIENCE_FILTERS.map((item) => {
                const selected = draft.audiences.includes(item.id);
                return (
                  <Chip
                    key={item.id}
                    label={item.label}
                    clickable
                    onClick={() => toggleAudience(item.id)}
                    sx={{
                      fontWeight: 700,
                      color: selected ? '#fff' : '#12325f',
                      bgcolor: selected ? '#175195' : '#f4f7fb',
                      '&:hover': { bgcolor: selected ? '#124578' : '#e7eef6' },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="About the event" text="Prizes and the note players read before they register." />
            <Stack spacing={2}>
              <TextField
                size="small"
                fullWidth
                label="Prizes"
                value={draft.prizeSummary}
                onChange={(event) => patch({ prizeSummary: event.target.value })}
              />
              <TextField
                size="small"
                fullWidth
                multiline
                minRows={4}
                label="Description"
                value={draft.description}
                onChange={(event) => patch({ description: event.target.value })}
              />
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="Sections" text="Each section has its own name, entry fee, and number of seats." />
            <Stack spacing={1.5}>
              {draft.sections.map((section, index) => (
                <Box
                  key={section.id}
                  sx={{ p: 2, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #DFE3E8' }}
                >
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 800, color: '#12325f' }}>Section {index + 1}</Typography>
                    <IconButton
                      aria-label={`Remove ${section.name || 'section'}`}
                      disabled={draft.sections.length === 1}
                      onClick={() => patch({ sections: draft.sections.filter((item) => item.id !== section.id) })}
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Name"
                        value={section.name}
                        onChange={(event) => updateSection(section.id, { name: event.target.value })}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Fee"
                        type="number"
                        value={section.fee}
                        onChange={(event) => updateSection(section.id, { fee: Number(event.target.value) })}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Seats"
                        type="number"
                        value={section.capacity}
                        onChange={(event) => updateSection(section.id, { capacity: Number(event.target.value) })}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  patch({
                    sections: [...draft.sections, { id: crypto.randomUUID(), name: '', fee: 0, capacity: 16 }],
                  })
                }
                sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 700, borderColor: '#175195', color: '#175195' }}
              >
                Add section
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', px: { xs: 2, md: 3 }, py: 2 }}>
            {embedded && (
              <Button color="inherit" onClick={() => setShowForm(false)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Cancel
              </Button>
            )}
            <Button variant="contained" onClick={save} sx={registerButtonSx}>
              {editingId ? 'Save changes' : 'Publish tournament'}
            </Button>
          </Stack>
        </Card>

        {editingId && (
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>Entries</Typography>
            {entries.length === 0 && <Typography sx={{ color: chessColors.muted }}>No registrations yet.</Typography>}
            <Stack spacing={1}>
              {entries.map((item) => (
                <Stack key={item.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography>
                      {item.lastName}, {item.firstName} · {item.sectionName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: chessColors.muted }}>
                      {item.email} · {dayjs(item.createdAt).format('MMM D, YYYY')}
                    </Typography>
                  </Box>
                  <Button size="small" color="error" onClick={() => removeRegistration(item.id)}>
                    Remove
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {!embedded && chess.messages.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>Contact messages</Typography>
            <Stack spacing={1.5}>
              {chess.messages.map((item) => (
                <Box key={item.id}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {item.name} · {item.email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: chessColors.muted }}>
                    {dayjs(item.createdAt).format('MMM D, YYYY h:mm A')}
                  </Typography>
                  <Typography>{item.message}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {!embedded && <Button
          sx={{ mt: 4 }}
          color="inherit"
          onClick={() => {
            if (!window.confirm('Replace tournaments and entries with the sample events?')) return;
            restoreSampleEvents();
            startNew();
            setNotice('Sample events restored.');
          }}
        >
          Restore sample events
        </Button>}
      </Container>
  );

  if (embedded) {
    return <DashboardContent maxWidth="lg">{page}</DashboardContent>;
  }

  return <SiteShell>{page}</SiteShell>;
}
