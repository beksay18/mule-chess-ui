import { useState, type ReactNode } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { signIn, signUp } from 'src/api/auth';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { isValidEmail, stripPhoneDigits, formatUsPhoneNumber, isValidUsPhoneNumber } from 'src/utils/validator';

import { saveAccount } from './account';
import { SiteShell, usePageTitle } from './site-shell';
import { chessColors, registerButtonSx } from './theme';

// ----------------------------------------------------------------------

const HERO = '/assets/images/chess-hero.jpg';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: '#fff',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: chessColors.green },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: chessColors.green },
} as const;

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error && 'response' in error) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    if (message === 'Bad credentials' || message === 'User not found') return 'Incorrect email or password.';
    if (message) return message;
  }
  return fallback;
}

function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <SiteShell variant="plain">
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            minHeight: { md: 560 },
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: '#fff',
            border: `1px solid ${chessColors.line}`,
            boxShadow: '0 24px 60px rgba(28, 42, 36, 0.08)',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'relative',
              alignItems: 'flex-end',
              p: 4,
              color: '#fff',
              backgroundImage: `linear-gradient(180deg, rgba(12,24,18,0.15), rgba(12,24,18,0.78)), url(${HERO})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
            }}
          >
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 13, letterSpacing: 1.4, fontWeight: 800, textTransform: 'uppercase' }}>
                Mule Chess
              </Typography>
              <Typography sx={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1, maxWidth: 360 }}>
                Your seat at the next tournament.
              </Typography>
              <Typography sx={{ maxWidth: 360, color: 'rgba(255,255,255,0.86)' }}>{subtitle}</Typography>
            </Stack>
          </Box>
          <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center' }}>
            <Stack spacing={2.5} sx={{ width: '100%' }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {title}
              </Typography>
              {children}
            </Stack>
          </Box>
        </Box>
      </Container>
    </SiteShell>
  );
}

export function LoginView() {
  usePageTitle('Log in · Mule Chess');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email)) {
      setError('Enter the email on your account.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setPending(true);
    setError('');
    try {
      const response = await signIn({ username: email.trim(), password });
      saveAccount(response);
      router.push(response.role === 'ROLE_ADMIN' || response.role === 'ROLE_MANAGER' ? '/dashboard' : '/');
    } catch (err) {
      setError(apiMessage(err, 'Could not reach the Mule Chess server. Is the API running?'));
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout title="Log in" subtitle="Sign in to register for events and keep your entries under your name.">
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            sx={fieldSx}
            fullWidth
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            sx={fieldSx}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((open) => !open)} edge="end">
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button type="submit" variant="contained" disabled={pending} sx={{ ...registerButtonSx, py: 1.2 }}>
            {pending ? 'Signing in…' : 'Log in'}
          </Button>
        </Stack>
      </Box>
      <Typography sx={{ color: chessColors.muted }}>
        New here?{' '}
        <Link component={RouterLink} href="/sign-up" sx={{ fontWeight: 700 }}>
          Create an account
        </Link>
      </Typography>
    </AuthLayout>
  );
}

export function RegisterAccountView() {
  usePageTitle('Create account · Mule Chess');
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Enter your first and last name.');
      return;
    }
    if (!isValidEmail(form.email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!isValidUsPhoneNumber(form.phone)) {
      setError('Enter a 10-digit phone number.');
      return;
    }
    if (form.password.length < 8) {
      setError('Use at least 8 characters for the password.');
      return;
    }
    setPending(true);
    setError('');
    try {
      await signUp({
        username: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: stripPhoneDigits(form.phone),
      });
      const response = await signIn({ username: form.email.trim(), password: form.password });
      saveAccount(response);
      router.push('/');
    } catch (err) {
      setError(apiMessage(err, 'Could not reach the Mule Chess server. Is the API running?'));
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="One account covers every Mule Chess event you enter.">
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="First name" value={form.firstName} onChange={(event) => set('firstName', event.target.value)} sx={fieldSx} fullWidth />
            <TextField label="Last name" value={form.lastName} onChange={(event) => set('lastName', event.target.value)} sx={fieldSx} fullWidth />
          </Stack>
          <TextField label="Email" type="email" value={form.email} autoComplete="email" onChange={(event) => set('email', event.target.value)} sx={fieldSx} fullWidth />
          <TextField
            label="Phone"
            value={form.phone}
            placeholder="(816) 555-0142"
            onChange={(event) => set('phone', formatUsPhoneNumber(event.target.value))}
            sx={fieldSx}
            fullWidth
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            autoComplete="new-password"
            onChange={(event) => set('password', event.target.value)}
            sx={fieldSx}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((open) => !open)} edge="end">
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button type="submit" variant="contained" disabled={pending} sx={{ ...registerButtonSx, py: 1.2 }}>
            {pending ? 'Creating account…' : 'Create account'}
          </Button>
        </Stack>
      </Box>
      <Typography sx={{ color: chessColors.muted }}>
        Already registered?{' '}
        <Link component={RouterLink} href="/sign-in" sx={{ fontWeight: 700 }}>
          Log in
        </Link>
      </Typography>
    </AuthLayout>
  );
}
