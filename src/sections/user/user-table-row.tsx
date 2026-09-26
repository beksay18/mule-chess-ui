import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { updateUserAccess } from 'src/api/user';

const BRAND_BLUE = '#175195';

export type UserProps = {
    userId: number;
    username: string;
    dateCreated: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    active: boolean;
    provider: string;
};

type UserTableRowProps = {
    row: UserProps;
    onChanged: () => void;
};

type AccountRole = 'user' | 'admin';

function getInitials(firstName: string, lastName: string) {
    const first = firstName?.charAt(0) ?? '';
    const last = lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || '?';
}

function normalizeRole(role: string): AccountRole {
    return role?.toUpperCase().includes('ADMIN') ? 'admin' : 'user';
}

function getProviderStyle(provider: string) {
    if (provider?.toUpperCase() === 'GOOGLE') {
        return { label: 'Google', bgcolor: alpha('#4285f4', 0.12), color: '#1967d2' };
    }
    return { label: 'Email', bgcolor: alpha(BRAND_BLUE, 0.08), color: BRAND_BLUE };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
}

function errorMessage(error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
        const message = (error as { response?: { data?: { message?: string } } }).response?.data
            ?.message;
        if (message) {
            return message;
        }
    }
    return 'Could not update this user. Please try again.';
}

export function UserTableRow({ row, onChanged }: UserTableRowProps) {
    const theme = useTheme();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fullName = [row.firstName, row.lastName].filter(Boolean).join(' ') || '—';
    const provider = getProviderStyle(row.provider);
    const role = normalizeRole(row.role);

    const save = async (nextRole: AccountRole, active: boolean) => {
        setSaving(true);
        setError('');
        try {
            await updateUserAccess(row.userId, { role: nextRole, active });
            onChanged();
        } catch (updateError) {
            setError(errorMessage(updateError));
        } finally {
            setSaving(false);
        }
    };

    const handleRoleChange = (nextRole: AccountRole) => {
        if (nextRole === role) {
            return;
        }
        if (
            nextRole === 'admin' &&
            !window.confirm('Make this user an admin? They will no longer appear in this list.')
        ) {
            return;
        }
        save(nextRole, row.active);
    };

    return (
        <TableRow
            hover
            sx={{
                bgcolor: !row.active ? alpha(theme.palette.grey[500], 0.04) : 'inherit',
                '&:last-child td': { borderBottom: 0 },
            }}
        >
            <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            bgcolor: alpha(BRAND_BLUE, 0.12),
                            color: BRAND_BLUE,
                        }}
                    >
                        {getInitials(row.firstName, row.lastName)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, color: theme.palette.grey[900] }}>
                            {fullName}
                        </Typography>
                        <Link
                            href={`mailto:${row.username}`}
                            sx={{
                                color: BRAND_BLUE,
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 260,
                            }}
                        >
                            {row.username}
                        </Link>
                        {error && (
                            <Typography variant="caption" sx={{ color: 'error.main' }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>{row.phoneNumber || '—'}</TableCell>
            <TableCell>
                <Select
                    size="small"
                    value={role}
                    disabled={saving}
                    onChange={(event) => handleRoleChange(event.target.value as AccountRole)}
                    sx={{ minWidth: 130, bgcolor: '#ffffff' }}
                >
                    <MenuItem value="user">Customer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>
            </TableCell>
            <TableCell>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(row.active)}
                            disabled={saving}
                            onChange={(_, checked) => save(role, checked)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2e7d32' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#4caf50',
                                },
                            }}
                        />
                    }
                    label={row.active ? 'Active' : 'Inactive'}
                    sx={{
                        m: 0,
                        '& .MuiFormControlLabel-label': {
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            color: row.active ? '#2e7d32' : '#616161',
                        },
                    }}
                />
            </TableCell>
            <TableCell>
                <Chip
                    label={provider.label}
                    size="small"
                    sx={{
                        height: 24,
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        bgcolor: provider.bgcolor,
                        color: provider.color,
                    }}
                />
            </TableCell>
            <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {formatDate(row.dateCreated)}
            </TableCell>
        </TableRow>
    );
}
