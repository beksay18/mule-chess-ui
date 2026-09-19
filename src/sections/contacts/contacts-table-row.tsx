import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { markContactAsDone } from '../../api/contacts';

const BRAND_BLUE = '#175195';

export type ContactsProps = {
    id: number;
    name: string;
    email: string;
    orderNumber: string;
    message: string;
    fileUrl: string;
    dateCreated: string;
    contactStatus: string;
};

type ContactsTableRowProps = {
    row: ContactsProps;
    onMarkedDone: () => void;
};

function getStatusStyle(status: string) {
    const normalized = status?.toLowerCase();
    if (normalized === 'new') {
        return { label: 'New', bgcolor: alpha(BRAND_BLUE, 0.12), color: BRAND_BLUE };
    }
    if (normalized === 'done') {
        return { label: 'Done', bgcolor: alpha('#4caf50', 0.12), color: '#2e7d32' };
    }
    return {
        label: status || 'Unknown',
        bgcolor: alpha(BRAND_BLUE, 0.08),
        color: BRAND_BLUE,
    };
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

export function ContactsTableRow({ row, onMarkedDone }: ContactsTableRowProps) {
    const theme = useTheme();
    const [detailOpen, setDetailOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';
    const isNew = row.contactStatus?.toLowerCase() === 'new';
    const status = getStatusStyle(row.contactStatus);

    const handleMarkAsDone = async () => {
        try {
            setIsLoading(true);
            await markContactAsDone(row.id);
            setConfirmOpen(false);
            setDetailOpen(false);
            onMarkedDone();
        } catch (error) {
            console.error('Failed to mark as done', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <TableRow
                hover
                sx={{
                    bgcolor: isNew ? alpha(BRAND_BLUE, 0.03) : 'inherit',
                    '&:last-child td': { borderBottom: 0 },
                }}
            >
                <TableCell sx={{ fontWeight: 600, color: theme.palette.grey[900] }}>
                    {row.name}
                </TableCell>
                <TableCell>
                    <Link href={`mailto:${row.email}`} sx={{ color: BRAND_BLUE, fontWeight: 500 }}>
                        {row.email}
                    </Link>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                    {row.orderNumber || '—'}
                </TableCell>
                <TableCell sx={{ maxWidth: 240 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.5,
                        }}
                    >
                        {row.message}
                    </Typography>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {formatDate(row.dateCreated)}
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
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                        <Tooltip title="View message">
                            <IconButton size="small" onClick={() => setDetailOpen(true)} sx={{ color: BRAND_BLUE }}>
                                <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {isNew && (
                            <Tooltip title="Mark as done">
                                <IconButton
                                    size="small"
                                    onClick={() => setConfirmOpen(true)}
                                    sx={{ color: '#2e7d32' }}
                                >
                                    <CheckCircleOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </TableCell>
            </TableRow>

            <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>Contact message</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 0.5 }}>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                From
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
                            <Link href={`mailto:${row.email}`} sx={{ color: BRAND_BLUE }}>
                                {row.email}
                            </Link>
                        </Box>
                        {row.orderNumber && (
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    Order number
                                </Typography>
                                <Typography>{row.orderNumber}</Typography>
                            </Box>
                        )}
                        <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                Message
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                {row.message}
                            </Typography>
                        </Box>
                        {row.fileUrl && (
                            <Button
                                component="a"
                                href={`${baseURL}${row.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<AttachFileOutlinedIcon />}
                                sx={{
                                    alignSelf: 'flex-start',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: BRAND_BLUE,
                                }}
                            >
                                View attachment
                            </Button>
                        )}
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            Received {formatDate(row.dateCreated)}
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    {isNew && (
                        <Button
                            onClick={() => {
                                setDetailOpen(false);
                                setConfirmOpen(true);
                            }}
                            sx={{ textTransform: 'none', fontWeight: 600, color: '#2e7d32' }}
                        >
                            Mark as done
                        </Button>
                    )}
                    <Button
                        onClick={() => setDetailOpen(false)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Mark as done?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'text.secondary' }}>
                        This will mark the message from {row.name} as handled.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleMarkAsDone}
                        disabled={isLoading}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: BRAND_BLUE,
                            '&:hover': { bgcolor: '#124578' },
                        }}
                    >
                        {isLoading ? 'Saving…' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
