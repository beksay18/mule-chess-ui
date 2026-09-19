import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

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
};

function getInitials(firstName: string, lastName: string) {
    const first = firstName?.charAt(0) ?? '';
    const last = lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || '?';
}

function formatRole(role: string) {
    const normalized = role?.toUpperCase() ?? '';
    if (normalized.includes('ADMIN')) {
        return { label: 'Admin', bgcolor: alpha(BRAND_BLUE, 0.12), color: BRAND_BLUE };
    }
    if (normalized.includes('USER')) {
        return { label: 'Customer', bgcolor: alpha('#607d8b', 0.12), color: '#455a64' };
    }
    return {
        label: role.replace(/^ROLE_/, ''),
        bgcolor: alpha(BRAND_BLUE, 0.08),
        color: BRAND_BLUE,
    };
}

function getActiveStyle(active: boolean) {
    if (active) {
        return { label: 'Active', bgcolor: alpha('#4caf50', 0.12), color: '#2e7d32' };
    }
    return { label: 'Inactive', bgcolor: alpha('#9e9e9e', 0.15), color: '#616161' };
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

export function UserTableRow({ row }: UserTableRowProps) {
    const theme = useTheme();

    const fullName = [row.firstName, row.lastName].filter(Boolean).join(' ') || '—';
    const role = formatRole(row.role);
    const status = getActiveStyle(row.active);
    const provider = getProviderStyle(row.provider);

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
                    </Box>
                </Stack>
            </TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>{row.phoneNumber || '—'}</TableCell>
            <TableCell>
                <Chip
                    label={role.label}
                    size="small"
                    sx={{
                        height: 24,
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        bgcolor: role.bgcolor,
                        color: role.color,
                    }}
                />
            </TableCell>
            <TableCell>
                <Chip
                    label={status.label}
                    size="small"
                    sx={{
                        height: 24,
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        bgcolor: status.bgcolor,
                        color: status.color,
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
