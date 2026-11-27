import { useState, useEffect, type ComponentProps } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
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
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
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

import { articlePlainText } from 'src/sections/blog/article-html';
import { DescriptionEditor } from 'src/sections/blog/description-editor';
import { listTournamentTypes, createTournamentRequest, deleteTournamentRequest, updateTournamentRequest } from 'src/api/tournament/tournament.api';

import type { TournamentTypeOption } from 'src/api/tournament/tournament.api';
import { DashboardContent } from 'src/layouts/dashboard';

import { isPast, US_STATES, ENTRY_FEES, isHappening, entryPayload, withEntryFees, locationLabel, ENTRY_FEE_FORM, formatShortRange } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import {
  useChessState,
  removeRegistration,
  restoreSampleEvents,
  refreshTournamentsFromApi,
} from './store';
import { chessColors, registerButtonSx } from './theme';

import type { Tournament, TournamentDraft, TournamentFormat, TournamentSection } from './types';

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

function FieldRequirement({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <Typography sx={{ color: '#d32f2f', fontSize: 12, fontWeight: 700, mb: 1.5, lineHeight: 1.4 }}>
      <Box component="span" sx={{ mr: 0.4 }}>*</Box>
      {text}
    </Typography>
  );
}

function RequiredField({
  message,
  fieldId,
  ...props
}: { message?: string; fieldId: string } & ComponentProps<typeof TextField>) {
  return (
    <Box id={fieldId}>
      <FieldRequirement text={message} />
      <TextField {...props} required fullWidth size="small" error={Boolean(message)} />
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
    street: '',
    city: '',
    state: 'MO',
    startDate: '',
    startTime: '',
    endDate: '',
    registrationCloses: '',
    registrationClosesTime: '',
    description: '',
    timeControl: 'regular',
    format: 'swiss',
    audiences: ['adults'],
    sections: [withEntryFees({ id: crypto.randomUUID(), name: '', fee: 40, capacity: 0, earlyFee: 40, earlyDeadline: '', regularFee: 40, regularDeadline: '', lateFee: 40, lateDeadline: '', onsiteFee: 40, onsiteDeadline: '' })],
  };
}

function toDraft(tournament: Tournament): TournamentDraft {
  return {
    name: tournament.name,
    organizer: tournament.organizer,
    street: tournament.street || '',
    city: tournament.city,
    state: tournament.state,
    startDate: tournament.startDate,
    startTime: tournament.startTime || '',
    endDate: tournament.endDate,
    registrationCloses: tournament.registrationCloses,
    registrationClosesTime: tournament.registrationClosesTime || '',
    description: tournament.description,
    timeControl: tournament.timeControl,
    format: tournament.format || 'swiss',
    audiences: [...tournament.audiences],
    sections: tournament.sections.map((section) => withEntryFees(section)),
  };
}

function detailFieldErrors(draft: TournamentDraft) {
  const errors: Record<string, string> = {};
  if (!draft.name.trim()) errors.name = 'Enter a tournament name.';
  if (!draft.organizer.trim()) errors.organizer = 'Enter an organizer.';
  if (!draft.street.trim()) errors.street = 'Enter a street.';
  if (!draft.city.trim()) errors.city = 'Enter a city.';
  if (!draft.state.trim()) errors.state = 'Enter a state.';
  if (!draft.startDate) errors.startDate = 'Enter the start date.';
  if (!draft.startTime) errors.startTime = 'Enter the start time.';
  if (!draft.endDate) errors.endDate = 'Enter the end date.';
  else if (draft.startDate && draft.endDate < draft.startDate) {
    errors.endDate = 'The end date has to be on or after the start date.';
  }
  if (!draft.registrationCloses) errors.registrationCloses = 'Enter the registration deadline.';
  else if (draft.endDate && draft.registrationCloses > draft.endDate) {
    errors.registrationCloses = 'Registration has to close on or before the last day.';
  }
  if (!draft.registrationClosesTime) errors.registrationClosesTime = 'Enter the time registration closes.';
  if (!articlePlainText(draft.description)) errors.description = 'Add a description players will read before they register.';
  return errors;
}

type SectionProblems = Partial<Record<
  | 'name'
  | 'capacity'
  | 'entries'
  | 'earlyFee'
  | 'earlyDeadline'
  | 'regularFee'
  | 'regularDeadline'
  | 'lateFee'
  | 'lateDeadline'
  | 'onsiteFee'
  | 'onsiteDeadline',
  string
>>;

function sectionFieldErrors(draft: TournamentDraft) {
  const errors: Record<string, SectionProblems> = {};
  draft.sections.forEach((section) => {
    const priced = withEntryFees(section);
    const item: SectionProblems = {};
    if (!priced.name.trim()) item.name = 'Enter a section name.';
    if (Number.isNaN(priced.capacity) || priced.capacity < 1) item.capacity = 'Enter room for at least one player.';
    const chosen = ENTRY_FEES.filter((entry) => priced[entry.enabled]);
    if (!chosen.length) item.entries = 'Choose at least one entry fee.';
    let previous = '';
    chosen.forEach((entry) => {
      const amount = priced[entry.fee];
      const deadline = priced[entry.deadline];
      const article = entry.key === 'early' ? 'an' : 'a';
      if (Number.isNaN(amount) || amount < 0) {
        item[entry.fee] = `Enter ${article} ${entry.label.toLowerCase()} fee of zero or more.`;
      }
      if (!deadline) item[entry.deadline] = `Enter the ${entry.label.toLowerCase()} deadline.`;
      else if (previous && deadline < previous) {
        item[entry.deadline] = `The ${entry.label.toLowerCase()} deadline has to be on or after the previous deadline.`;
      }
      if (deadline) previous = deadline;
    });
    if (Object.keys(item).length) errors[section.id] = item;
  });
  return errors;
}

function firstSectionField(errors: ReturnType<typeof sectionFieldErrors>) {
  const [sectionId, item] = Object.entries(errors)[0] || [];
  if (!sectionId || !item) return '';
  const order = [
    'name',
    'capacity',
    'entries',
    'regularFee',
    'regularDeadline',
    'earlyFee',
    'earlyDeadline',
    'lateFee',
    'lateDeadline',
    'onsiteFee',
    'onsiteDeadline',
  ] as const;
  const field = order.find((key) => item[key]) || 'name';
  return `tournament-section-${sectionId}-${field}`;
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
  const [step, setStep] = useState(0);
  const [detailsChecked, setDetailsChecked] = useState(false);
  const [sectionsChecked, setSectionsChecked] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'upcoming' | 'happening' | 'past'>('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const updateSection = (id: string, partial: Partial<TournamentSection>) => {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === id ? { ...section, ...partial } : section)),
    }));
  };

  const startNew = () => {
    setEditingId(null);
    setDraft(blankDraft());
    setStep(0);
    setDetailsChecked(false);
    setSectionsChecked(false);
    setError('');
    setNotice('');
  };

  const startEdit = (tournament: Tournament) => {
    setEditingId(tournament.id);
    setDraft(toDraft(tournament));
    setShowForm(true);
    setStep(0);
    setDetailsChecked(false);
    setSectionsChecked(false);
    setError('');
    setNotice('');
  };

  const confirmFormat = () => {
    setEditingId(null);
    setDraft({ ...blankDraft(), format: formatChoice });
    setShowForm(true);
    setStep(0);
    setDetailsChecked(false);
    setSectionsChecked(false);
    setFormatOpen(false);
    setError('');
    setNotice('');
  };

  const revealField = (fieldId: string) => {
    requestAnimationFrame(() => {
      document.getElementById(fieldId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const goToStep = (next: number) => {
    if (next === step) return;
    if (next > 0) {
      setDetailsChecked(true);
      const problems = detailFieldErrors(draft);
      const first = Object.keys(problems)[0];
      if (first) {
        setNotice('');
        revealField(`tournament-${first}`);
        return;
      }
    }
    setStep(next);
  };

  const save = async () => {
    const details = detailFieldErrors(draft);
    const sections = sectionFieldErrors(draft);
    const firstDetail = Object.keys(details)[0];
    const firstSection = firstSectionField(sections);
    if (firstDetail || firstSection) {
      setNotice('');
      if (firstDetail) {
        setDetailsChecked(true);
        setStep(0);
        revealField(`tournament-${firstDetail}`);
      } else {
        setSectionsChecked(true);
        revealField(firstSection);
      }
      return;
    }
    try {
      const payload = { ...draft, sections: draft.sections.map(entryPayload) };
      const saved = editingId
        ? await updateTournamentRequest(editingId, payload)
        : await createTournamentRequest(payload);
      await refreshTournamentsFromApi();
      setEditingId(saved.id);
      setDraft(toDraft(saved));
      if (embedded) {
        setShowForm(false);
        setStep(0);
      }
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
    return `${tournament.name} ${tournament.street || ''} ${tournament.city} ${tournament.state} ${tournament.organizer}`.toLowerCase().includes(needle);
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

  const detailProblems = detailsChecked ? detailFieldErrors(draft) : {};
  const sectionProblems = sectionsChecked ? sectionFieldErrors(draft) : {};

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
              onClick={() => { setShowForm(false); setStep(0); }}
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
            '& .MuiFormLabel-asterisk': { color: '#d32f2f' },
          }}
        >
          <Box sx={{ px: { xs: 2, md: 3 }, pt: 3 }}>
            <Stepper
              activeStep={step}
              sx={{
                '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': { color: '#175195' },
                '& .MuiStepLabel-label': { fontWeight: 700 },
              }}
            >
              {['Tournament Details', 'Sections'].map((label, index) => (
                <Step key={label} completed={step > index}>
                  <StepLabel onClick={() => goToStep(index)} sx={{ cursor: 'pointer' }}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {step === 0 && (
          <>
          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="Event" text="The name players see on the public list." />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <RequiredField fieldId="tournament-name" label="Name" message={detailProblems.name} value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <RequiredField fieldId="tournament-organizer" label="Organizer" message={detailProblems.organizer} value={draft.organizer} onChange={(event) => patch({ organizer: event.target.value })} />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="Place and dates" text="Where the games are played and when registration closes." />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <RequiredField fieldId="tournament-street" label="Street" message={detailProblems.street} value={draft.street} onChange={(event) => patch({ street: event.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 8, md: 8 }}>
                <RequiredField fieldId="tournament-city" label="City" message={detailProblems.city} value={draft.city} onChange={(event) => patch({ city: event.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                <RequiredField fieldId="tournament-state" select label="State" message={detailProblems.state} value={draft.state} onChange={(event) => patch({ state: event.target.value })}>
                  {US_STATES.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  ))}
                </RequiredField>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <RequiredField
                  fieldId="tournament-startDate"
                  type="date"
                  label="Starts"
                  message={detailProblems.startDate}
                  value={draft.startDate}
                  onChange={(event) => patch({ startDate: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <RequiredField
                  fieldId="tournament-startTime"
                  type="time"
                  label="Start time"
                  message={detailProblems.startTime}
                  value={draft.startTime}
                  onChange={(event) => patch({ startTime: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <RequiredField
                  fieldId="tournament-endDate"
                  type="date"
                  label="Ends"
                  message={detailProblems.endDate}
                  value={draft.endDate}
                  onChange={(event) => patch({ endDate: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <RequiredField
                  fieldId="tournament-registrationCloses"
                  type="date"
                  label="Registration closes"
                  message={detailProblems.registrationCloses}
                  value={draft.registrationCloses}
                  onChange={(event) => patch({ registrationCloses: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <RequiredField
                  fieldId="tournament-registrationClosesTime"
                  type="time"
                  label="Closes at"
                  message={detailProblems.registrationClosesTime}
                  value={draft.registrationClosesTime}
                  onChange={(event) => patch({ registrationClosesTime: event.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="About the event" text="Write the note players read before they register. Style it with headings, lists, and links." />
            <DescriptionEditor
              value={draft.description}
              onChange={(description) => patch({ description })}
              label="Description"
              required
              error={detailProblems.description}
              placeholder="Write what players should know. Headings, lists, quotes, and links are available above."
              caption="This is the description players see on the tournament page."
            />
          </Box>
          </>
          )}

          {step === 1 && (
          <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
            <FormSectionTitle title="Sections" text="Regular entry comes first. Turn on early, late, or onsite entry only when that fee applies." />
            <Stack spacing={2}>
              {draft.sections.map((section, index) => (
                <Box
                  key={section.id}
                  sx={{ borderRadius: 2, border: '1px solid #DFE3E8', bgcolor: '#fff', overflow: 'hidden' }}
                >
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', gap: 1.25, px: 2, py: 1.25, bgcolor: '#f4f8fd', borderBottom: '1px solid #DFE3E8' }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1,
                        bgcolor: '#175195',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography sx={{ flex: 1, fontWeight: 800, color: '#12325f' }}>
                      {section.name.trim() || `Section ${index + 1}`}
                    </Typography>
                    <IconButton
                      aria-label={`Remove ${section.name || 'section'}`}
                      disabled={draft.sections.length === 1}
                      onClick={() => patch({ sections: draft.sections.filter((item) => item.id !== section.id) })}
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                  <Box sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <RequiredField
                          fieldId={`tournament-section-${section.id}-name`}
                          label="Name"
                          autoComplete="off"
                          message={sectionProblems[section.id]?.name}
                          value={section.name}
                          onChange={(event) => updateSection(section.id, { name: event.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <RequiredField
                          fieldId={`tournament-section-${section.id}-capacity`}
                          label="Seats"
                          type="number"
                          autoComplete="off"
                          message={sectionProblems[section.id]?.capacity}
                          value={section.capacity || ''}
                          onChange={(event) => updateSection(section.id, { capacity: Number(event.target.value) })}
                        />
                      </Grid>
                    </Grid>
                    <Typography sx={{ mt: 2.25, mb: 1, fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: '#637381' }}>
                      Entry fees
                    </Typography>
                    <Stack id={`tournament-section-${section.id}-entries`} spacing={1}>
                      <FieldRequirement text={sectionProblems[section.id]?.entries} />
                      {ENTRY_FEE_FORM.map((entry) => {
                        const priced = withEntryFees(section);
                        const enabled = Boolean(priced[entry.enabled]);
                        return (
                          <Box
                            key={entry.key}
                            sx={{
                              px: 1.25,
                              py: enabled ? 1.25 : 0.25,
                              borderRadius: 1.5,
                              border: '1px solid',
                              borderColor: enabled ? '#175195' : '#DFE3E8',
                              bgcolor: enabled ? '#f7fafd' : '#fff',
                            }}
                          >
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'flex-start' } }}>
                              <FormControlLabel
                                sx={{ m: 0, minWidth: { md: 180 }, flexShrink: 0, height: { md: 40 } }}
                                control={
                                  <Checkbox
                                    checked={enabled}
                                    onChange={(event) => {
                                      const on = event.target.checked;
                                      const change: Partial<TournamentSection> = { [entry.enabled]: on };
                                      if (!on) change[entry.deadline] = '';
                                      updateSection(section.id, change);
                                    }}
                                    sx={{ color: '#175195', '&.Mui-checked': { color: '#175195' } }}
                                  />
                                }
                                label={<Typography sx={{ fontWeight: 800, color: '#12325f' }}>{entry.label}</Typography>}
                              />
                              {enabled && (
                                <Grid container spacing={1.5} sx={{ flex: 1 }}>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                    <RequiredField
                                      fieldId={`tournament-section-${section.id}-${entry.fee}`}
                                      label="Fee"
                                      type="number"
                                      message={sectionProblems[section.id]?.[entry.fee]}
                                      value={section[entry.fee]}
                                      onChange={(event) => {
                                        const amount = Number(event.target.value);
                                        const patchFees: Partial<TournamentSection> = { [entry.fee]: amount };
                                        if (entry.fee === 'regularFee') patchFees.fee = amount;
                                        updateSection(section.id, patchFees);
                                      }}
                                      slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                    <RequiredField
                                      fieldId={`tournament-section-${section.id}-${entry.deadline}`}
                                      label="Deadline"
                                      type="date"
                                      message={sectionProblems[section.id]?.[entry.deadline]}
                                      value={section[entry.deadline]}
                                      onChange={(event) => updateSection(section.id, { [entry.deadline]: event.target.value })}
                                      slotProps={{ inputLabel: { shrink: true } }}
                                    />
                                  </Grid>
                                </Grid>
                              )}
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                </Box>
              ))}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  patch({
                    sections: [...draft.sections, withEntryFees({ id: crypto.randomUUID(), name: '', fee: 0, capacity: 0, earlyFee: 0, earlyDeadline: '', regularFee: 0, regularDeadline: '', lateFee: 0, lateDeadline: '', onsiteFee: 0, onsiteDeadline: '' })],
                  })
                }
                sx={{
                  py: 1.25,
                  borderStyle: 'dashed',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderColor: '#175195',
                  color: '#175195',
                  bgcolor: '#fff',
                }}
              >
                Add section
              </Button>
            </Stack>
          </Box>
          )}

          <Divider />

          {error && <Alert severity="error" sx={{ mx: { xs: 2, md: 3 }, mt: 2 }}>{error}</Alert>}

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', px: { xs: 2, md: 3 }, py: 2 }}>
            {step === 1 && (
              <Button
                color="inherit"
                startIcon={<ArrowBackIcon />}
                onClick={() => goToStep(0)}
                sx={{ textTransform: 'none', fontWeight: 700, mr: 'auto' }}
              >
                Back
              </Button>
            )}
            {embedded && (
              <Button color="inherit" onClick={() => { setShowForm(false); setStep(0); }} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Cancel
              </Button>
            )}
            {step === 0 ? (
              <Button
                variant="contained"
                onClick={() => goToStep(1)}
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#175195', '&:hover': { bgcolor: '#124578' } }}
              >
                Next
              </Button>
            ) : (
              <Button variant="contained" onClick={save} sx={registerButtonSx}>
                {editingId ? 'Save changes' : 'Publish tournament'}
              </Button>
            )}
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
