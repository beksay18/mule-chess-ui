import * as React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Alert
} from '@mui/material';
import { updatePersonalInfo } from '../../../api/profile';
import { ProfileRequest } from '../../../api/profile/type';
import {
    formatUsPhoneNumber,
    isValidUsPhoneNumber,
    stripPhoneDigits,
} from '../../../utils/validator';

interface Props {
    open: boolean;
    onClose: () => void;
    userId: number;
    initialData: ProfileRequest;
}

export default function UpdatePhoneDialog({ open, onClose, userId, initialData }: Props) {
    const [form, setForm] = React.useState<ProfileRequest>(initialData);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setForm({
                ...initialData,
                phoneNumber: formatUsPhoneNumber(initialData.phoneNumber || ''),
            });
            setError(null);
            setSuccess(null);
        }
    }, [open, initialData]);

    const handleSubmit = async () => {
        if (!isValidUsPhoneNumber(form.phoneNumber)) {
            setError('Enter a valid 10-digit US phone number');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await updatePersonalInfo(userId, {
                ...form,
                phoneNumber: stripPhoneDigits(form.phoneNumber),
            });
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
            <DialogTitle>Update Phone Number</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <TextField
                    label="Phone number"
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            phoneNumber: formatUsPhoneNumber(e.target.value),
                        }))
                    }
                    placeholder="(555) 555-5555"
                    fullWidth
                    sx={{ mt: 2 }}
                    slotProps={{
                        htmlInput: { inputMode: 'numeric', maxLength: 14 },
                    }}
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
