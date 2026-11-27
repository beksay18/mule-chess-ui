import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { FormPanel, LabeledRow } from './form';
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
            Registering holds a seat in the section you choose. A section closes when it reaches capacity. If you are
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

export function ContactView() {
  usePageTitle('Contact · Mule Chess');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!name.trim() || !message.trim()) {
      setError('Enter your name and a message.');
      return;
    }
    if (!isEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    sendMessage({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
    setError('');
    setSent(true);
  };

  return (
    <SiteShell>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Contact
        </Typography>
        <Typography sx={{ color: chessColors.muted, mb: 2 }}>
          Questions about an event go to the organizer. This form keeps a message on this browser for the person
          running the tournaments.
        </Typography>
        {sent && <Alert severity="success" sx={{ mb: 2 }}>Message sent.</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <FormPanel title="Message">
          <LabeledRow label="Name">
            <TextField size="small" fullWidth value={name} onChange={(event) => setName(event.target.value)} />
          </LabeledRow>
          <LabeledRow label="Email">
            <TextField size="small" fullWidth type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </LabeledRow>
          <LabeledRow label="Message">
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </LabeledRow>
          <Button variant="contained" onClick={submit} sx={{ ml: { sm: '218px' }, mt: 1 }}>
            Send
          </Button>
        </FormPanel>
      </Container>
    </SiteShell>
  );
}
