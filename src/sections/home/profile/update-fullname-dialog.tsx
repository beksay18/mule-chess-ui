import * as React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Alert
} from '@mui/material';
import { updatePersonalInfo } from '../../../api/profile';
import { ProfileRequest } from '../../../api/profile/type';

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number;
    initialData: ProfileRequest;
}

export default function UpdateFullnameDialog({ open, onClose, userId, initialData }: Props) {
    const [form, setForm] = React.useState<ProfileRequest>(initialData);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
        if (open) {
            setForm(initialData);
            setError(null);
            setSuccess(null);
        }
    }, [open, initialData]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await updatePersonalInfo(userId, form);
            const current = JSON.parse(sessionStorage.getItem('current-user') || '{}');

            sessionStorage.setItem(
                'current-user',
                JSON.stringify({
                    ...current,
                    person: res,
                })
            );
            setSuccess("Profile updated successfully");
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
            <DialogTitle>Update Display Name</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <TextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{mt: 2}}
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
