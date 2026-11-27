import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from 'dayjs';

import { FormPanel, LabeledRow } from './form';
import { US_STATES, TIME_CONTROLS, locationLabel, AUDIENCE_FILTERS, formatShortRange } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import {
  useChessState,
  createTournament,
  deleteTournament,
  updateTournament,
  removeRegistration,
  restoreSampleEvents,
} from './store';
import { chessColors, registerButtonSx } from './theme';

import type { Tournament, AudienceTag, TimeControl, TournamentDraft, TournamentSection } from './types';

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

export function ManageView() {
  usePageTitle('Organize · Mule Chess');
  const chess = useChessState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TournamentDraft>(blankDraft);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

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
    setError('');
    setNotice('');
  };

  const save = () => {
    const problem = validate(draft);
    if (problem) {
      setError(problem);
      setNotice('');
      return;
    }
    if (editingId) {
      updateTournament(editingId, draft);
      setNotice('Tournament updated.');
    } else {
      const created = createTournament(draft);
      setEditingId(created.id);
      setNotice('Tournament published. Players can register from the tournaments list.');
    }
    setError('');
  };

  const remove = (tournament: Tournament) => {
    if (!window.confirm(`Delete ${tournament.name}? Entries for it will be removed too.`)) return;
    deleteTournament(tournament.id);
    if (editingId === tournament.id) startNew();
    setNotice('Tournament deleted.');
  };

  return (
    <SiteShell>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Organize
            </Typography>
            <Typography sx={{ color: chessColors.muted }}>
              Publish a tournament, then players register from the public list. Saved in this browser.
            </Typography>
          </Box>
          <Button variant="outlined" onClick={startNew}>
            New tournament
          </Button>
        </Stack>

        {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={1} sx={{ mb: 4 }}>
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
        </Stack>

        <FormPanel title={editingId ? 'Edit tournament' : 'New tournament'}>
          <LabeledRow label="Name">
            <TextField size="small" fullWidth value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
          </LabeledRow>
          <LabeledRow label="Organizer">
            <TextField size="small" fullWidth value={draft.organizer} onChange={(event) => patch({ organizer: event.target.value })} />
          </LabeledRow>
          <LabeledRow label="City">
            <TextField size="small" fullWidth value={draft.city} onChange={(event) => patch({ city: event.target.value })} />
          </LabeledRow>
          <LabeledRow label="State">
            <TextField select size="small" fullWidth value={draft.state} onChange={(event) => patch({ state: event.target.value })}>
              {US_STATES.map((code) => (
                <MenuItem key={code} value={code}>
                  {code}
                </MenuItem>
              ))}
            </TextField>
          </LabeledRow>
          <LabeledRow label="Starts">
            <TextField size="small" fullWidth type="date" value={draft.startDate} onChange={(event) => patch({ startDate: event.target.value })} />
          </LabeledRow>
          <LabeledRow label="Ends">
            <TextField size="small" fullWidth type="date" value={draft.endDate} onChange={(event) => patch({ endDate: event.target.value })} />
          </LabeledRow>
          <LabeledRow label="Registration closes">
            <TextField
              size="small"
              fullWidth
              type="date"
              value={draft.registrationCloses}
              onChange={(event) => patch({ registrationCloses: event.target.value })}
            />
          </LabeledRow>
          <LabeledRow label="Time control">
            <TextField
              select
              size="small"
              fullWidth
              value={draft.timeControl}
              onChange={(event) => patch({ timeControl: event.target.value as TimeControl })}
            >
              {TIME_CONTROLS.filter((item) => item.id).map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </LabeledRow>
          <LabeledRow label="Tags">
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {AUDIENCE_FILTERS.map((item) => (
                <Button
                  key={item.id}
                  size="small"
                  variant={draft.audiences.includes(item.id) ? 'contained' : 'outlined'}
                  onClick={() => toggleAudience(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </LabeledRow>
          <LabeledRow label="Prizes">
            <TextField
              size="small"
              fullWidth
              value={draft.prizeSummary}
              onChange={(event) => patch({ prizeSummary: event.target.value })}
            />
          </LabeledRow>
          <LabeledRow label="Description">
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={4}
              value={draft.description}
              onChange={(event) => patch({ description: event.target.value })}
            />
          </LabeledRow>
        </FormPanel>

        <FormPanel title="Sections">
          <Stack spacing={2}>
            {draft.sections.map((section) => (
              <Stack key={section.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
                <TextField
                  size="small"
                  label="Name"
                  value={section.name}
                  onChange={(event) => updateSection(section.id, { name: event.target.value })}
                  sx={{ flex: 1 }}
                />
                <TextField
                  size="small"
                  label="Fee"
                  type="number"
                  value={section.fee}
                  onChange={(event) => updateSection(section.id, { fee: Number(event.target.value) })}
                  sx={{ width: { sm: 120 } }}
                />
                <TextField
                  size="small"
                  label="Capacity"
                  type="number"
                  value={section.capacity}
                  onChange={(event) => updateSection(section.id, { capacity: Number(event.target.value) })}
                  sx={{ width: { sm: 120 } }}
                />
                <IconButton
                  aria-label={`Remove ${section.name || 'section'}`}
                  disabled={draft.sections.length === 1}
                  onClick={() =>
                    patch({ sections: draft.sections.filter((item) => item.id !== section.id) })
                  }
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              sx={{ alignSelf: 'flex-start' }}
              onClick={() =>
                patch({
                  sections: [...draft.sections, { id: crypto.randomUUID(), name: '', fee: 0, capacity: 16 }],
                })
              }
            >
              Add section
            </Button>
          </Stack>
        </FormPanel>

        <Button variant="contained" onClick={save} sx={registerButtonSx}>
          {editingId ? 'Save changes' : 'Publish tournament'}
        </Button>

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

        {chess.messages.length > 0 && (
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

        <Button
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
        </Button>
      </Container>
    </SiteShell>
  );
}
