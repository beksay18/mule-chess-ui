import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { getCurrentUser } from '../../../api';
import { formatUsPhoneNumber } from '../../../utils/validator';
import ChangePasswordDialog from './change-password-dialog';
import UpdateFullnameDialog from './update-fullname-dialog';
import UpdatePhoneDialog from './update-phone-dialog';

const BRAND_BLUE = '#175195';

type ProfileRowProps = {
    label: string;
    value: string;
    onEdit?: () => void;
};

function ProfileRow({ label, value, onEdit }: ProfileRowProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                py: 2,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
                borderBottom: `1px solid ${theme.palette.grey[100]}`,
                '&:last-of-type': { borderBottom: 'none' },
            }}
        >
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                        mb: 0.5,
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: theme.palette.grey[900],
                        wordBreak: 'break-word',
                    }}
                >
                    {value}
                </Typography>
            </Box>
            {onEdit && (
                <Link
                    component="button"
                    type="button"
                    onClick={onEdit}
                    underline="hover"
                    sx={{
                        flexShrink: 0,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: BRAND_BLUE,
                        cursor: 'pointer',
                        border: 'none',
                        bgcolor: 'transparent',
                        p: 0,
                        mt: 0.25,
                    }}
                >
                    Edit
                </Link>
            )}
        </Box>
    );
}

export default function ProfilePage() {
    const theme = useTheme();
    const user = getCurrentUser();
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
    const [updatePhoneOpen, setUpdatePhoneOpen] = useState(false);

    const fullName = [user?.person?.firstName, user?.person?.lastName].filter(Boolean).join(' ');
    const phoneDisplay = user?.person?.phoneNumber
        ? formatUsPhoneNumber(user.person.phoneNumber)
        : '—';

    const initialProfile = {
        firstName: user?.person?.firstName || '',
        lastName: user?.person?.lastName || '',
        phoneNumber: user?.person?.phoneNumber || '',
    };

    return (
        <>
            <Stack spacing={3} sx={{ width: '100%' }}>
                <Box component="h1" sx={{ m: 0 }}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.375rem', md: '1.5rem' },
                            letterSpacing: '-0.02em',
                            color: theme.palette.grey[900],
                            mb: 0.5,
                        }}
                    >
                        Profile settings
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                        Update your personal information and password.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        borderTop: `1px solid ${theme.palette.grey[100]}`,
                        pt: 1,
                    }}
                >
                    <ProfileRow
                        label="Display name"
                        value={fullName || '—'}
                        onEdit={() => setUpdateProfileOpen(true)}
                    />
                    <ProfileRow label="Email" value={user?.username || '—'} />
                    <ProfileRow
                        label="Password"
                        value="•••••••••••"
                        onEdit={() => setChangePasswordOpen(true)}
                    />
                    <ProfileRow
                        label="Phone"
                        value={phoneDisplay}
                        onEdit={() => setUpdatePhoneOpen(true)}
                    />
                </Box>
            </Stack>

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
        </>
    );
}
