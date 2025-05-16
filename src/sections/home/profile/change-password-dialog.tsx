import * as React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, IconButton, InputAdornment, Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { changePassword } from '../../../api/profile';

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number;
}

export default function ChangePasswordDialog({ open, onClose, userId }: Props) {
    const [form, setForm] = React.useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
        if (open) {
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setError(null);
            setSuccess(null);
        }
    }, [open]);

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword(userId, {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });
            setSuccess(res.message);
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Something went wrong";
            setError(backendMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <TextField
                    label="Old Password"
                    name="oldPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.oldPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPasswords((s) => !s)}>
                                    {showPasswords ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="New Password"
                    name="newPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
