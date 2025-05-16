import * as React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Container, Button,
} from '@mui/material';
import { getCurrentUser } from '../../../api';
import ShippingAddressSection from "./shipping-address-section";
import ChangePasswordDialog from "./change-password-dialog";
import UpdateProfileDialog from "./update-profile-dialog";

export default function ProfilePage() {
    const user = getCurrentUser();
    const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
    const [updateProfileOpen, setUpdateProfileOpen] = React.useState(false);

    const initialProfile = {
        firstName: user?.person?.firstName || '',
        lastName: user?.person?.lastName || '',
        phoneNumber: user?.person?.phoneNumber || '',
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Box
                sx={{
                    mx: 'auto',
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    boxShadow: 3,
                }}
            >
                <Box
                    sx={{
                        backgroundImage: 'linear-gradient(135deg, #4469b4 0%, #96a6d2 100%)',
                        borderRadius: 3,
                        p: 4,
                        position: 'relative',
                        color: 'white',
                    }}
                >
                    <Avatar
                        src="/avatar-placeholder.png"
                        sx={{
                            width: 100,
                            height: 100,
                            border: '4px solid white',
                            position: 'absolute',
                            top: 24,
                            left: 24,
                        }}
                    />
                    <Box sx={{ ml: 16, pt: -5 }}>
                        <Typography variant="h5" fontWeight={700}>
                            {user?.person?.firstName} {user?.person?.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {user?.username}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {user?.person?.phoneNumber}
                        </Typography>
                    </Box>
                </Box>

                {user?.userId && (
                    <>
                        <Box sx={{ mt: 3 }}>
                            <Button variant="outlined" onClick={() => setChangePasswordOpen(true)}>
                                Change Password
                            </Button>
                            <Button variant="outlined" onClick={() => setUpdateProfileOpen(true)} sx={{ml: 2}}>
                                Update Profile Info
                            </Button>
                        </Box>
                        <ChangePasswordDialog
                            open={changePasswordOpen}
                            onClose={() => setChangePasswordOpen(false)}
                            userId={user.userId}
                        />
                        <UpdateProfileDialog
                            open={updateProfileOpen}
                            onClose={() => setUpdateProfileOpen(false)}
                            userId={user.userId}
                            initialData={initialProfile}
                        />
                        <ShippingAddressSection userId={user.userId}  />
                    </>
                )}
            </Box>
        </Container>
    );
}

