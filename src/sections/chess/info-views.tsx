import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { isEmail } from './format';
import { SiteShell, usePageTitle } from './site-shell';
import { sendMessage } from './store';
import { chessColors } from './theme';

// ----------------------------------------------------------------------

export function AboutView() {
  usePageTitle('About · Mule Chess');
  return (
    <SiteShell>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          About Mule Chess
        </Typography>
        <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
          Mule Chess is a registration desk for chess tournaments. Organizers publish an event with sections, fees, and
          a capacity. Players choose a section and confirm their entry. The entry list updates as soon as that
          registration is confirmed.
        </Typography>
        <Typography sx={{ lineHeight: 1.7, mb: 2 }}>
          Results and pairings can be posted after the rounds are played. Past events stay on the site so players can
          look up who played.
        </Typography>
        <Typography sx={{ lineHeight: 1.7 }}>
          To publish a tournament, open Organize from the Support menu. Entries and events are saved in this browser.
        </Typography>
      </Container>
    </SiteShell>
  );
}

export function TermsView() {
  usePageTitle('Terms · Mule Chess');
  return (
    <SiteShell>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Terms and fair play
        </Typography>
        <Stack spacing={2}>
          <Typography sx={{ lineHeight: 1.7 }}>
            Joining holds your place in the section you choose. A section closes when it reaches its player limit. If you are
            already in the cart for that event, a second entry with the same email is not accepted.
          </Typography>
          <Typography sx={{ lineHeight: 1.7 }}>
            Withdraw before the registration deadline if you cannot play, and ask the organizer to remove the entry.
            After the deadline the organizer decides whether a refund is available.
          </Typography>
          <Typography sx={{ lineHeight: 1.7 }}>
            Players are expected to follow the laws of chess, arrive for the round on time, and record the result with
            the opponent. The organizer may remove an entry that was made with a false name.
          </Typography>
          <Typography sx={{ lineHeight: 1.7, color: chessColors.muted }}>
            The fee shown at registration is the amount due to the organizer. Mule Chess records the entry; it does not
            charge a card in this version.
          </Typography>
        </Stack>
      </Container>
    </SiteShell>
  );
}

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

function ContactField({
  id,
  label,
  value,
  onChange,
  error,
  type,
  multiline,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={{ display: 'block', mb: 0.6, color: NAVY, fontSize: 13, fontWeight: 700 }}>
        {label}
        <Box component="span" sx={{ color: '#d32f2f' }}> *</Box>
      </Typography>
      {error && (
        <Typography sx={{ mb: 0.5, color: '#d32f2f', fontSize: 13, fontWeight: 600 }}>* {error}</Typography>
      )}
      <TextField
        id={id}
        fullWidth
        size="small"
        type={type}
        multiline={multiline}
        minRows={multiline ? 5 : undefined}
        value={value}
        error={Boolean(error)}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        sx={fieldSx}
      />
    </Box>
  );
}

export function ContactView() {
  usePageTitle('Contact · Mule Chess');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [checked, setChecked] = useState(false);
  const [sent, setSent] = useState(false);

  const nameError = checked && !name.trim() ? 'Enter your name.' : '';
  const emailError = checked && !isEmail(email) ? 'Enter a valid email address.' : '';
  const messageError = checked && !message.trim() ? 'Enter a message.' : '';

  const submit = () => {
    setChecked(true);
    if (!name.trim() || !isEmail(email) || !message.trim()) return;
    sendMessage({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
    setChecked(false);
    setSent(true);
  };

  return (
    <SiteShell>
      <Box sx={{ bgcolor: '#f6f8fb', borderTop: `1px solid ${alpha(NAVY, 0.06)}`, minHeight: { xs: 'calc(100dvh - 64px)', md: 'calc(100dvh - 72px)' } }}>
        <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography sx={{ color: '#2888A0', fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase' }}>
            Support
          </Typography>
          <Typography component="h1" sx={{ mt: 0.75, color: NAVY, fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.15rem' }, letterSpacing: '-0.03em' }}>
            Contact
          </Typography>
          <Typography sx={{ mt: 1, mb: 3, color: alpha(NAVY, 0.7), lineHeight: 1.6 }}>
            Questions about an event go to the organizer. This form keeps a message on this browser for the person running the tournaments.
          </Typography>
          <Box
            sx={{
              bgcolor: '#fff',
              border: `1px solid ${alpha(NAVY, 0.08)}`,
              borderRadius: 3,
              boxShadow: `0 8px 24px ${alpha(NAVY, 0.04)}`,
              p: { xs: 2, md: 3 },
            }}
          >
            <Stack spacing={2}>
              <ContactField id="contact-name" label="Name" value={name} onChange={setName} error={nameError} />
              <ContactField id="contact-email" label="Email" value={email} onChange={setEmail} error={emailError} type="email" />
              <ContactField id="contact-message" label="Message" value={message} onChange={setMessage} error={messageError} multiline />
              <Box>
                <Button
                  variant="contained"
                  onClick={submit}
                  sx={{
                    mt: 0.5,
                    px: 3,
                    bgcolor: '#175195',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#124578' },
                  }}
                >
                  Send
                </Button>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
      <Snackbar
        open={sent}
        autoHideDuration={4000}
        onClose={(_event, reason) => {
          if (reason === 'clickaway') return;
          setSent(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ top: { xs: 80, md: 88 } }}
      >
        <Alert severity="success" onClose={() => setSent(false)} sx={{ alignItems: 'center', boxShadow: 2 }}>
          Message sent.
        </Alert>
      </Snackbar>
    </SiteShell>
  );
}
