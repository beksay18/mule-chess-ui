import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { getCurrentUser } from 'src/api';
import { updatePersonalInfo } from 'src/api/profile';
import { DashboardContent } from 'src/layouts/dashboard';
import { stripPhoneDigits, formatUsPhoneNumber } from 'src/utils/validator';

const BRAND_BLUE = '#175195';

function roleLabel(role?: string) {
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_MANAGER') return 'Manager';
    return 'User';
}

function readUser() {
    const user = getCurrentUser();
    return {
        firstName: user?.person?.firstName || '',
        lastName: user?.person?.lastName || '',
        phoneNumber: user?.person?.phoneNumber ? formatUsPhoneNumber(user.person.phoneNumber) : '',
        email: user?.username || '',
        role: roleLabel(user?.role),
        userId: user?.userId,
    };
}

export function AccountProfileView() {
    const initial = readUser();
    const [firstName, setFirstName] = useState(initial.firstName);
    const [lastName, setLastName] = useState(initial.lastName);
    const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSave = async () => {
        if (!initial.userId) {
            setError('Sign in again to update your profile.');
            return;
        }
        const trimmedFirst = firstName.trim();
        const trimmedLast = lastName.trim();
        const digits = stripPhoneDigits(phoneNumber);
        if (!trimmedFirst || !trimmedLast) {
            setError('First and last name are required.');
            return;
        }
        if (digits && digits.length !== 10) {
            setError('Enter a 10-digit phone number.');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const saved = await updatePersonalInfo(initial.userId, {
                firstName: trimmedFirst,
                lastName: trimmedLast,
                phoneNumber: digits,
            });
            const current = getCurrentUser();
            if (current) {
                sessionStorage.setItem(
                    'current-user',
                    JSON.stringify({
                        ...current,
                        person: {
                            firstName: saved.firstName,
                            lastName: saved.lastName,
                            phoneNumber: saved.phoneNumber,
                        },
                    })
                );
                window.dispatchEvent(new Event('current-user-updated'));
            }
            setFirstName(saved.firstName || '');
            setLastName(saved.lastName || '');
            setPhoneNumber(saved.phoneNumber ? formatUsPhoneNumber(saved.phoneNumber) : '');
            setSuccess('Profile saved.');
        } catch {
            setError('The profile could not be saved. Try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardContent maxWidth="md">
            <Stack spacing={3} sx={{ mb: 4 }}>
                <Typography sx={{ color: 'text.secondary' }}>
                    Your name, email, and phone for this account.
                </Typography>
                <Paper
                    elevation={0}
                    sx={{ p: 3, borderRadius: 2.5, border: '1px solid', borderColor: 'grey.200' }}
                >
                    <Stack spacing={2.5}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="First name"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Last name"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                fullWidth
                            />
                        </Stack>
                        <TextField label="Email" value={initial.email} fullWidth disabled />
                        <TextField
                            label="Phone"
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(formatUsPhoneNumber(event.target.value))}
                            fullWidth
                            placeholder="(555) 555-5555"
                        />
                        <TextField label="Role" value={initial.role} fullWidth disabled />
                        <Box>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={saving}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: BRAND_BLUE,
                                    '&:hover': { bgcolor: '#124578' },
                                }}
                            >
                                {saving ? 'Saving…' : 'Save profile'}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Stack>
        </DashboardContent>
    );
}
