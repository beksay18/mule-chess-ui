import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { ContactReply, getContactReplies, replyToContact } from '../../api/contacts';

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
    waiting?: boolean;
};

type ContactsTableRowProps = {
    row: ContactsProps;
    onMarkedDone: () => void;
};

function getStatusStyle(waiting: boolean) {
    if (waiting) {
        return { label: 'Waiting', bgcolor: alpha('#ed6c02', 0.12), color: '#b45309' };
    }
    return { label: 'Replied', bgcolor: alpha('#4caf50', 0.12), color: '#2e7d32' };
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

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

function fileHref(url: string, baseURL: string) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `${baseURL}${url}`;
}

export function ContactsTableRow({ row, onMarkedDone }: ContactsTableRowProps) {
    const theme = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const threadRef = useRef<HTMLDivElement>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [replies, setReplies] = useState<ContactReply[]>([]);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyFile, setReplyFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState('');

    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';
    const waiting = row.waiting !== false;
    const status = getStatusStyle(waiting);

    useEffect(() => {
        let active = true;
        if (detailOpen) {
            setRepliesLoading(true);
            getContactReplies(row.id)
                .then((data) => {
                    if (active) {
                        setReplies(data);
                    }
                })
                .catch(() => {
                    if (active) {
                        setReplies([]);
                    }
                })
                .finally(() => {
                    if (active) {
                        setRepliesLoading(false);
                    }
                });
        }
        return () => {
            active = false;
        };
    }, [detailOpen, row.id]);

    useEffect(() => {
        if (threadRef.current) {
            threadRef.current.scrollTop = threadRef.current.scrollHeight;
        }
    }, [replies, repliesLoading, detailOpen]);

    const handleSendReply = async () => {
        const message = replyText.trim();
        if (!message || sending) {
            return;
        }
        if (replyFile && replyFile.size > MAX_DOCUMENT_BYTES) {
            setSendError('The document must be 10 MB or smaller.');
            return;
        }
        setSending(true);
        setSendError('');
        try {
            const saved = await replyToContact(row.id, message, replyFile ?? undefined);
            setReplies((current) => [...current, saved]);
            setReplyText('');
            setReplyFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onMarkedDone();
        } catch {
            setSendError('The email could not be sent. Try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <TableRow
                hover
                sx={{
                    bgcolor: waiting ? alpha('#ed6c02', 0.04) : 'inherit',
                    '&:last-child td': { borderBottom: 0 },
                }}
            >
                <TableCell sx={{ fontWeight: 600, color: theme.palette.grey[900] }}>
                    {row.name}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                    {row.email}
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
                        <Tooltip title="Reply by email">
                            <IconButton size="small" onClick={() => setDetailOpen(true)} sx={{ color: BRAND_BLUE }}>
                                <ReplyOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>

            <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Reply to {row.name}
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {row.email}
                        {row.orderNumber ? ` · Order ${row.orderNumber}` : ''}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 0.5 }}>
                        <Box
                            ref={threadRef}
                            sx={{
                                maxHeight: 320,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.25,
                                pr: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    alignSelf: 'flex-start',
                                    maxWidth: '88%',
                                    bgcolor: 'grey.100',
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 1.25,
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    {row.name}
                                </Typography>
                                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {row.message}
                                </Typography>
                                {row.fileUrl && (
                                    <Button
                                        component="a"
                                        href={fileHref(row.fileUrl, baseURL)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        startIcon={<AttachFileOutlinedIcon />}
                                        sx={{ mt: 0.5, px: 0, textTransform: 'none', fontWeight: 600, color: BRAND_BLUE }}
                                    >
                                        View attachment
                                    </Button>
                                )}
                                <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', mt: 0.5 }}>
                                    {formatDate(row.dateCreated)}
                                </Typography>
                            </Box>

                            {repliesLoading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                                    <CircularProgress size={22} />
                                </Box>
                            )}

                            {replies.map((reply) => {
                                const fromCustomer = Boolean(reply.fromCustomer);
                                return (
                                <Box
                                    key={reply.id}
                                    sx={{
                                        alignSelf: fromCustomer ? 'flex-start' : 'flex-end',
                                        maxWidth: '88%',
                                        bgcolor: fromCustomer ? 'grey.100' : alpha(BRAND_BLUE, 0.08),
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 1.25,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{ fontWeight: 700, color: fromCustomer ? 'text.primary' : BRAND_BLUE }}
                                    >
                                        {reply.authorName || (fromCustomer ? row.name : 'You')}
                                    </Typography>
                                    <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                        {reply.message}
                                    </Typography>
                                    {reply.fileUrl && (
                                        <Button
                                            component="a"
                                            href={fileHref(reply.fileUrl, baseURL)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="small"
                                            startIcon={<AttachFileOutlinedIcon />}
                                            sx={{ mt: 0.5, px: 0, textTransform: 'none', fontWeight: 600, color: BRAND_BLUE }}
                                        >
                                            {reply.fileName || 'View document'}
                                        </Button>
                                    )}
                                    <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', mt: 0.5 }}>
                                        {fromCustomer ? formatDate(reply.sentAt) : `Sent ${formatDate(reply.sentAt)}`}
                                    </Typography>
                                </Box>
                                );
                            })}
                        </Box>

                        <TextField
                            multiline
                            minRows={3}
                            fullWidth
                            placeholder={`Write a reply to ${row.email}`}
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            onChange={(event) => {
                                const next = event.target.files?.[0] ?? null;
                                setReplyFile(next);
                                setSendError('');
                            }}
                        />
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Button
                                startIcon={<AttachFileOutlinedIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{ textTransform: 'none', fontWeight: 600, color: BRAND_BLUE }}
                            >
                                Upload document
                            </Button>
                            {replyFile && (
                                <Chip
                                    label={replyFile.name}
                                    onDelete={() => {
                                        setReplyFile(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    deleteIcon={<CloseIcon />}
                                    size="small"
                                />
                            )}
                        </Stack>
                        {sendError && (
                            <Typography variant="body2" color="error">
                                {sendError}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button
                        variant="contained"
                        onClick={handleSendReply}
                        disabled={sending || !replyText.trim()}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: BRAND_BLUE,
                            '&:hover': { bgcolor: '#124578' },
                        }}
                    >
                        {sending ? 'Sending…' : 'Send email'}
                    </Button>
                    <Button
                        onClick={() => setDetailOpen(false)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
