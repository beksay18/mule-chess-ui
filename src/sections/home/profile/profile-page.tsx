import * as React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Container, Button,Link
} from '@mui/material';
import {getCurrentUser} from '../../../api';
import ChangePasswordDialog from "./change-password-dialog";
import UpdateFullnameDialog from "./update-fullname-dialog";
import UpdatePhoneDialog from "./update-phone-dialog";

export default function ProfilePage() {
    const user = getCurrentUser();
    const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
    const [updateProfileOpen, setUpdateProfileOpen] = React.useState(false);
    const [updatePhoneOpen, setUpdatePhoneOpen] = React.useState(false);

    const initialProfile = {
        firstName: user?.person?.firstName || '',
        lastName: user?.person?.lastName || '',
        phoneNumber: user?.person?.phoneNumber || '',
    };

    return (
        <Container sx={{mt: 5}}>
            <Box
                sx={{
                    p: 2,
                    position: 'relative',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Avatar
                    src="/avatar-placeholder.png"
                    sx={{
                        width: 70,
                        height: 70,
                        border: '4px solid white',
                        position: 'absolute',
                        top: 10,
                        left: 10,
                    }}
                />
                <Box sx={{ml: 10}}>
                    <Typography variant="h4" fontWeight={700}>
                        {user?.person?.firstName} {user?.person?.lastName}
                    </Typography>
                    <Typography variant="body2">
                        {user?.username}
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    p: 2,
                    position: 'relative',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box>
                    <Typography fontWeight={700}>
                        Display Name
                    </Typography>
                    <Typography variant="body2">
                        {user?.person?.firstName} {user?.person?.lastName}
                    </Typography>
                </Box>
                <Box>
                    <Link onClick={() => setUpdateProfileOpen(true)} fontWeight={700} sx={{ cursor: 'pointer' }}>
                        edit
                    </Link>
                </Box>
            </Box>
            <Box
                sx={{
                    p: 2,
                    position: 'relative',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Box>
                    <Typography fontWeight={700}>
                        Email Address
                    </Typography>
                    <Typography variant="body2">
                        {user?.username}
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    p: 2,
                    position: 'relative',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box>
                    <Typography fontWeight={700}>
                        Password
                    </Typography>
                    <Typography variant="body2">
                        ***********
                    </Typography>
                </Box>
                <Box>
                    <Link onClick={() => setChangePasswordOpen(true)} fontWeight={700} sx={{ cursor: 'pointer' }}>
                        edit
                    </Link>
                </Box>
            </Box>
            <Box
                sx={{
                    p: 2,
                    position: 'relative',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box>
                    <Typography fontWeight={700}>
                        Phone Number
                    </Typography>
                    <Typography variant="body2">
                        {user?.person?.phoneNumber}
                    </Typography>
                </Box>
                <Box>
                    <Link onClick={() => setUpdatePhoneOpen(true)} fontWeight={700} sx={{ cursor: 'pointer' }}>
                        edit
                    </Link>
                </Box>
            </Box>

            {user?.userId && (
                <>
                    <ChangePasswordDialog
                        open={changePasswordOpen}
                        onClose={() => setChangePasswordOpen(false)}
                        userId={user.userId}
                    />
                    <UpdateFullnameDialog
                        open={updateProfileOpen}
                        onClose={() => setUpdateProfileOpen(false)}
                        userId={user.userId}
                        initialData={initialProfile}
                    />
                    <UpdatePhoneDialog
                        open={updatePhoneOpen}
                        onClose={() => setUpdatePhoneOpen(false)}
                        userId={user.userId}
                        initialData={initialProfile}
                    />
                </>
            )}
        </Container>
    );
}

