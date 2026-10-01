import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { getCurrentUser } from 'src/api';
import { changePassword } from 'src/api/profile';
import { DashboardContent } from 'src/layouts/dashboard';

const BRAND_BLUE = '#175195';

export function AccountSettingsView() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSave = async () => {
        const userId = getCurrentUser()?.userId;
        if (!userId) {
            setError('Sign in again to change your password.');
            return;
        }
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Fill in the current password and the new password.');
            return;
        }
        if (newPassword.length < 8) {
            setError('The new password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('The new passwords do not match.');
            return;
        }
        if (newPassword === currentPassword) {
            setError('Choose a password that is different from the current one.');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const result = await changePassword(userId, {
                oldPassword: currentPassword,
                newPassword,
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccess(result.message || 'Password updated.');
        } catch (err: unknown) {
            const response = (err as { response?: { data?: { message?: string } } })?.response;
            setError(response?.data?.message || 'The password could not be changed. Check the current password and try again.');
        } finally {
            setSaving(false);
        }
    };

    const visibility = (
        <InputAdornment position="end">
            <IconButton
                onClick={() => setShowPasswords((visible) => !visible)}
                edge="end"
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
            >
                {showPasswords ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
            </IconButton>
        </InputAdornment>
    );

    return (
        <DashboardContent maxWidth="md">
            <Stack spacing={3} sx={{ mb: 4 }}>
                <Typography sx={{ color: 'text.secondary' }}>
                    Change the password you use to sign in.
                </Typography>
                <Paper
                    elevation={0}
                    sx={{ p: 3, borderRadius: 2.5, border: '1px solid', borderColor: 'grey.200' }}
                >
                    <Stack spacing={2.5}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}
                        <TextField
                            label="Current password"
                            type={showPasswords ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            fullWidth
                            autoComplete="current-password"
                            slotProps={{ input: { endAdornment: visibility } }}
                        />
                        <TextField
                            label="New password"
                            type={showPasswords ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            fullWidth
                            autoComplete="new-password"
                            helperText="At least 8 characters"
                        />
                        <TextField
                            label="Confirm new password"
                            type={showPasswords ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            fullWidth
                            autoComplete="new-password"
                        />
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
                                {saving ? 'Saving…' : 'Update password'}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Stack>
        </DashboardContent>
    );
}
