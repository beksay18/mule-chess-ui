import { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import { FormPanel, LabeledRow } from './form';
import { money, formatRange, isRegistrationOpen } from './format';
import { SiteShell, MissingEvent, usePageTitle } from './site-shell';
import { addToCart, takenSeats, getSnapshot, useChessState } from './store';
import { chessColors, registerButtonSx } from './theme';

// ----------------------------------------------------------------------

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
  const [error, setError] = useState('');

  usePageTitle(tournament ? `Register for ${tournament.name}` : 'Register · Mule Chess');

  useEffect(() => {
    if (!tournament) return;
    const openSection = tournament.sections.find(
      (section) => takenSeats(getSnapshot(), tournament.id, section.id) < section.capacity
    );
    setSectionId(openSection?.id ?? '');
  }, [tournament]);

  if (!tournament) return <MissingEvent />;

  const open = isRegistrationOpen(tournament);

  const submit = () => {
    if (!accepted) {
      setError('Accept the terms to continue.');
      return;
    }
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
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {tournament.name} registration
        </Typography>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>{formatRange(tournament)}</Typography>
        <Typography sx={{ mb: 3, color: chessColors.muted }}>
          View{' '}
          <Link component={RouterLink} href={`/tournaments/${tournament.slug}`}>
            tournament information
          </Link>{' '}
          for the details. The{' '}
          <Link component={RouterLink} href={`/entry-list/${tournament.slug}`}>
            entry list
          </Link>{' '}
          updates when registration is confirmed.
        </Typography>

        {!open && <Alert severity="warning" sx={{ mb: 2 }}>Registration for this event is closed.</Alert>}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <FormPanel title="Player information">
          <LabeledRow label="First name">
            <TextField size="small" fullWidth required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </LabeledRow>
          <LabeledRow label="Last name">
            <TextField size="small" fullWidth required value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </LabeledRow>
          <LabeledRow label="Rating">
            <TextField
              size="small"
              fullWidth
              value={rating}
              placeholder="Optional"
              onChange={(event) => setRating(event.target.value)}
            />
          </LabeledRow>
          <LabeledRow label="Player ID">
            <TextField
              size="small"
              fullWidth
              value={federationId}
              placeholder="Optional"
              onChange={(event) => setFederationId(event.target.value)}
            />
          </LabeledRow>
        </FormPanel>

        <FormPanel title="Contact">
          <LabeledRow label="Email">
            <TextField
              size="small"
              fullWidth
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </LabeledRow>
        </FormPanel>

        <FormPanel title="Section">
          <RadioGroup value={sectionId} onChange={(event) => setSectionId(event.target.value)}>
            {tournament.sections.map((section) => {
              const taken = takenSeats(chess, tournament.id, section.id);
              const full = taken >= section.capacity;
              return (
                <FormControlLabel
                  key={section.id}
                  value={section.id}
                  disabled={full || !open}
                  control={<Radio />}
                  label={
                    <Typography component="span" sx={{ color: full ? 'error.main' : chessColors.ink }}>
                      {section.name} — {money(section.fee)}
                      {full ? ' — Section closed: capacity reached' : ` — ${section.capacity - taken} open`}
                    </Typography>
                  }
                />
              );
            })}
          </RadioGroup>
        </FormPanel>

        <FormControlLabel
          sx={{ mb: 2, alignItems: 'flex-start' }}
          control={<Checkbox checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />}
          label={
            <Typography>
              I have read and accept the{' '}
              <Link component={RouterLink} href="/terms">
                terms
              </Link>{' '}
              and fair play rules for this tournament.
            </Typography>
          }
        />

        <Button variant="contained" disabled={!open} onClick={submit} sx={registerButtonSx}>
          Add to cart
        </Button>
      </Container>
    </SiteShell>
  );
}
