import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Container,
} from '@mui/material';

import { getProfile, updateProfile } from '../../../api/profile';
import { ProfileRequest, ProfileResponse } from '../../../api/profile/type';
import { getCurrentUser } from '../../../api';
import { useRouter } from '../../../routes/hooks';

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [editPersonal, setEditPersonal] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [editShipping, setEditShipping] = useState(false);

    const [form, setForm] = useState<ProfileRequest>({
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });

    const user = getCurrentUser();

    useEffect(() => {
        if (!user?.userId) return;
        getProfile(user.userId).then((data) => {
            setProfile(data);
            setForm({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                oldPassword: '',
                newPassword: '',
                addressLine1: data.shippingAddress?.addressLine1 || '',
                addressLine2: data.shippingAddress?.addressLine2 || '',
                city: data.shippingAddress?.city || '',
                state: data.shippingAddress?.state || '',
                postalCode: data.shippingAddress?.postalCode || '',
                country: data.shippingAddress?.country || '',
            });
            setLoading(false);
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!user?.userId) return;
        try {
            await updateProfile(user.userId, form);
            alert('Profile updated successfully!');
            setEditPersonal(false);
            setEditPassword(false);
            setEditShipping(false);
        } catch (e) {
            console.error('Update failed:', e);
            alert('Failed to update profile.');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ pt: { xs: 4, sm: 8 }, pb: { xs: 8, sm: 16 } }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    My Profile
                </Typography>

                {/* Personal Information */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Personal Information
                </Typography>

                {editPersonal ? (
                    <>
                        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} mb={2}>
                            <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                            <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                        </Box>
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button onClick={() => setEditPersonal(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleSubmit}>Save</Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography><strong>First Name:</strong> {form.firstName}</Typography>
                        <Typography><strong>Last Name:</strong> {form.lastName}</Typography>
                        <Typography><strong>Phone Number:</strong> {form.phoneNumber}</Typography>
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                            <Button variant="text" onClick={() => setEditPersonal(true)}>Edit</Button>
                        </Box>
                    </>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Change Password */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Change Password
                </Typography>

                {editPassword ? (
                    <>
                        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} mb={2}>
                            <TextField fullWidth label="Old Password" name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} />
                            <TextField fullWidth label="New Password" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />
                        </Box>
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button onClick={() => setEditPassword(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleSubmit}>Save</Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography>Password is hidden for security reasons.</Typography>
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                            <Button variant="text" onClick={() => setEditPassword(true)}>Change Password</Button>
                        </Box>
                    </>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Shipping Address */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Shipping Address
                </Typography>

                {editShipping ? (
                    <>
                        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} mb={2}>
                            <TextField fullWidth label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} />
                            <TextField fullWidth label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleChange} />
                        </Box>
                        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} mb={2}>
                            <TextField fullWidth label="City" name="city" value={form.city} onChange={handleChange} />
                            <TextField fullWidth label="State" name="state" value={form.state} onChange={handleChange} />
                            <TextField fullWidth label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="Country" name="country" value={form.country} onChange={handleChange} />
                        </Box>
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button onClick={() => setEditShipping(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleSubmit}>Save</Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography>{form.addressLine1}</Typography>
                        {form.addressLine2 && <Typography>{form.addressLine2}</Typography>}
                        <Typography>{form.city}, {form.state} {form.postalCode}</Typography>
                        <Typography>{form.country}</Typography>
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                            <Button variant="text" onClick={() => setEditShipping(true)}>Edit</Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
}
