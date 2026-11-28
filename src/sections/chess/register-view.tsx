import { useRef, useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { useParams } from 'react-router';

import { searchUsChessPlayers } from 'src/api/player/player.api';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import type { UsChessPlayer } from 'src/api/player/player.api';

import { DateBadge } from './date-badge';
import { money, isEmail, activeFee, formatRange, locationLabel, tournamentStatus, isRegistrationOpen, sectionTimeControlLabel } from './format';
import { SiteShell, MissingEvent, usePageTitle } from './site-shell';
import { addToCart, takenSeats, getSnapshot, useChessState } from './store';
import { chessColors } from './theme';

// ----------------------------------------------------------------------

const NAVY = '#12325f';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f7f9fc',
    borderRadius: 2,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(NAVY, 0.12),
  },
};

function RegisterField({
  id,
  label,
  value,
  onChange,
  error,
  type,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={{ display: 'block', mb: 0.6, color: NAVY, fontSize: 13, fontWeight: 700 }}>
        {label}
        {required && <Box component="span" sx={{ color: '#d32f2f' }}> *</Box>}
      </Typography>
      {error && (
        <Typography sx={{ mb: 0.5, color: '#d32f2f', fontSize: 13, fontWeight: 600 }}>* {error}</Typography>
      )}
      <TextField
        id={id}
        fullWidth
        size="small"
        type={type}
        placeholder={placeholder}
        value={value}
        error={Boolean(error)}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        sx={fieldSx}
      />
    </Box>
  );
}

function PlayerLookup({ onPick }: { onPick: (player: UsChessPlayer) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UsChessPlayer[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [picked, setPicked] = useState('');
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setStatus('idle');
      return undefined;
    }
    const current = requestId.current + 1;
    requestId.current = current;
    const timer = window.setTimeout(() => {
      setStatus('loading');
      searchUsChessPlayers(trimmed)
        .then((players) => {
          if (current !== requestId.current) return;
          setResults(players);
          setStatus('done');
        })
        .catch(() => {
          if (current !== requestId.current) return;
          setResults([]);
          setStatus('error');
        });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const choose = (player: UsChessPlayer) => {
    onPick(player);
    setPicked(`${player.lastName}, ${player.firstName}`);
    setQuery('');
    setResults([]);
    setStatus('idle');
  };

  return (
    <Box>
      <Typography component="label" htmlFor="register-uschess" sx={{ display: 'block', mb: 0.6, color: NAVY, fontSize: 13, fontWeight: 700 }}>
        US Chess ID or name
      </Typography>
      <TextField
        id="register-uschess"
        fullWidth
        size="small"
        placeholder="Search to fill the form"
        value={query}
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value);
          setPicked('');
        }}
        sx={fieldSx}
      />
      {status === 'loading' && (
        <Typography sx={{ mt: 0.75, color: alpha(NAVY, 0.65), fontSize: 13 }}>Searching US Chess…</Typography>
      )}
      {status === 'error' && (
        <Typography sx={{ mt: 0.75, color: '#d32f2f', fontSize: 13, fontWeight: 600 }}>
          US Chess search is unavailable. You can still type the fields below.
        </Typography>
      )}
      {status === 'done' && results.length === 0 && (
        <Typography sx={{ mt: 0.75, color: alpha(NAVY, 0.65), fontSize: 13 }}>No matching player.</Typography>
      )}
      {results.length > 0 && (
        <Stack spacing={0.75} sx={{ mt: 1 }}>
          {results.map((player) => (
            <Button
              key={player.id}
              onClick={() => choose(player)}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 0.5,
                textTransform: 'none',
                textAlign: 'left',
                color: NAVY,
                bgcolor: '#f7f9fc',
                borderRadius: 2,
                px: 1.5,
                py: 1,
                '&:hover': { bgcolor: alpha('#175195', 0.08) },
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>{player.lastName}, {player.firstName}</Typography>
              <Typography variant="body2" sx={{ color: chessColors.muted }}>
                {[player.id, player.state, player.rating || 'Unrated'].filter(Boolean).join(' · ')}
              </Typography>
            </Button>
          ))}
        </Stack>
      )}
      {picked && status === 'idle' && (
        <Typography sx={{ mt: 0.75, color: '#175195', fontSize: 13, fontWeight: 700 }}>
          {picked} is filled in. Add an email to continue.
        </Typography>
      )}
    </Box>
  );
}

export function RegisterView() {
  const { slug = '' } = useParams();
  const router = useRouter();
  const chess = useChessState();
  const tournament = chess.tournaments.find((item) => item.slug === slug);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('');
  const [federationId, setFederationId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');

  usePageTitle(tournament ? `Register for ${tournament.name}` : 'Register · Mule Chess');

  useEffect(() => {
    if (!tournament) return;
    const openSection = tournament.sections.find(
      (section) => takenSeats(getSnapshot(), tournament.id, section.id) < section.capacity
    );
    setSectionId(openSection?.id ?? '');
  }, [tournament]);

  if (!tournament || tournamentStatus(tournament) === 'NEW') return <MissingEvent />;

  const open = isRegistrationOpen(tournament);
  const chosen = tournament.sections.find((section) => section.id === sectionId);
  const firstNameError = checked && !firstName.trim() ? 'Enter a first name.' : '';
  const lastNameError = checked && !lastName.trim() ? 'Enter a last name.' : '';
  const emailError = checked && !isEmail(email) ? 'Enter a valid email address.' : '';
  const sectionError = checked && !sectionId ? 'Choose a section.' : '';
  const termsError = checked && !accepted ? 'Accept the terms to continue.' : '';

  const submit = () => {
    setChecked(true);
    setError('');
    if (!firstName.trim() || !lastName.trim() || !isEmail(email) || !sectionId || !accepted) return;
    const message = addToCart({
      tournamentId: tournament.id,
      sectionId,
      sectionName: '',
      fee: 0,
      firstName,
      lastName,
      email,
      rating,
      federationId,
    });
    if (message) {
      setError(message);
      return;
    }
    router.push('/registration-cart');
  };

  return (
    <SiteShell>
      <Box sx={{ bgcolor: '#f6f8fb', borderTop: `1px solid ${alpha(NAVY, 0.06)}`, minHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100dvh - 72px)' } }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, mb: 3 }}>
            <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
            <Box>
              <Typography component="h1" sx={{ color: NAVY, fontWeight: 800, fontSize: { xs: '1.7rem', md: '2.1rem' }, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                {tournament.name}
              </Typography>
              <Typography sx={{ mt: 0.5, color: alpha(NAVY, 0.7) }}>
                {formatRange(tournament)} · {locationLabel(tournament)}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 0.75 }}>
                <Link component={RouterLink} href={`/tournaments/${tournament.slug}`} sx={{ color: '#175195', fontWeight: 700 }}>
                  Event page
                </Link>
                <Link component={RouterLink} href={`/entry-list/${tournament.slug}`} sx={{ color: '#175195', fontWeight: 700 }}>
                  Entry List
                </Link>
              </Stack>
            </Box>
          </Stack>

          {!open && <Alert severity="warning" sx={{ mb: 2 }}>Registration for this event is closed.</Alert>}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              alignItems: 'start',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            }}
          >
            <Box
              sx={{
                bgcolor: '#fff',
                border: `1px solid ${alpha(NAVY, 0.08)}`,
                borderRadius: 3,
                boxShadow: `0 8px 24px ${alpha(NAVY, 0.04)}`,
                p: { xs: 2, md: 2.5 },
              }}
            >
              <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: '1.05rem', mb: 0.4 }}>Player information</Typography>
              <Typography sx={{ mb: 2, color: alpha(NAVY, 0.65), fontSize: 14 }}>
                Search by US Chess ID or name, or type the name for the wall chart.
              </Typography>
              <Stack spacing={2}>
                <PlayerLookup
                  onPick={(player) => {
                    setFirstName(player.firstName);
                    setLastName(player.lastName);
                    setRating(player.rating);
                    setFederationId(player.id);
                  }}
                />
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <RegisterField id="register-first" label="First name" value={firstName} onChange={setFirstName} error={firstNameError} required />
                  <RegisterField id="register-last" label="Last name" value={lastName} onChange={setLastName} error={lastNameError} required />
                </Box>
                <RegisterField id="register-email" label="Email" value={email} onChange={setEmail} error={emailError} type="email" placeholder="name@email.com" required />
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <RegisterField id="register-rating" label="Rating" value={rating} onChange={setRating} placeholder="If you have one" />
                  <RegisterField id="register-id" label="Player ID" value={federationId} onChange={setFederationId} placeholder="If you have one" />
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: '#fff',
                border: `1px solid ${alpha(NAVY, 0.08)}`,
                borderRadius: 3,
                boxShadow: `0 8px 24px ${alpha(NAVY, 0.04)}`,
                p: { xs: 2, md: 2.5 },
              }}
            >
              <Typography sx={{ color: NAVY, fontWeight: 800, fontSize: '1.05rem' }}>
                Choose a section
                <Box component="span" sx={{ color: '#d32f2f' }}> *</Box>
              </Typography>
              <Typography sx={{ mt: 0.4, mb: 1.5, color: alpha(NAVY, 0.65), fontSize: 14 }}>
                The fee shown is the one due today.
              </Typography>
              {sectionError && (
                <Typography sx={{ mb: 1, color: '#d32f2f', fontSize: 13, fontWeight: 600 }}>* {sectionError}</Typography>
              )}
              <RadioGroup value={sectionId} onChange={(event) => setSectionId(event.target.value)} sx={{ gap: 1.25 }}>
                {tournament.sections.map((section) => {
                  const taken = takenSeats(chess, tournament.id, section.id);
                  const full = taken >= section.capacity;
                  const selected = sectionId === section.id;
                  const clock = sectionTimeControlLabel(section);
                  return (
                    <Box
                      key={section.id}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${selected ? '#175195' : alpha(NAVY, 0.1)}`,
                        bgcolor: '#fff',
                        boxShadow: selected ? `inset 4px 0 0 #175195` : 'none',
                        opacity: full || !open ? 0.6 : 1,
                      }}
                    >
                      <FormControlLabel
                        value={section.id}
                        disabled={full || !open}
                        sx={{ m: 0, width: '100%', alignItems: 'stretch', '& .MuiFormControlLabel-label': { width: '100%' } }}
                        control={<Radio sx={{ alignSelf: 'center', ml: 1 }} />}
                        label={
                          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1.5 }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ color: full ? 'error.main' : NAVY, fontWeight: 800, fontSize: '1.05rem' }}>{section.name}</Typography>
                              <Typography variant="body2" sx={{ color: full ? 'error.main' : chessColors.muted, mt: 0.25 }}>
                                {[clock, full ? 'Full' : `${section.capacity - taken} places left`].filter(Boolean).join(' · ')}
                              </Typography>
                            </Box>
                            <Typography sx={{ color: '#175195', fontWeight: 800, fontSize: '1.25rem', flexShrink: 0 }}>{money(activeFee(section))}</Typography>
                          </Stack>
                        }
                      />
                    </Box>
                  );
                })}
              </RadioGroup>

              <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${alpha(NAVY, 0.08)}` }}>
                {termsError && (
                  <Typography sx={{ mb: 0.5, color: '#d32f2f', fontSize: 13, fontWeight: 600 }}>* {termsError}</Typography>
                )}
                <FormControlLabel
                  sx={{ alignItems: 'flex-start', ml: 0 }}
                  control={<Checkbox checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />}
                  label={
                    <Typography sx={{ color: alpha(NAVY, 0.85), pt: 0.75 }}>
                      I agree to the{' '}
                      <Link component={RouterLink} href="/terms" sx={{ color: '#175195', fontWeight: 700 }}>
                        fair play rules.
                      </Link>
                    </Typography>
                  }
                />
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!open}
                  onClick={submit}
                  sx={{
                    mt: 1.5,
                    py: 1.15,
                    bgcolor: '#175195',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#124578' },
                  }}
                >
                  {chosen ? `Continue · ${money(activeFee(chosen))}` : 'Continue'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </SiteShell>
  );
}
