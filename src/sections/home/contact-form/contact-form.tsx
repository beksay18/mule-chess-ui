import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { alpha, useTheme } from '@mui/material/styles';
import { ContactsRequest, createContacts } from '../../../api/contacts';

const BRAND_BLUE = '#175195';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(BRAND_BLUE, 0.4),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND_BLUE,
        },
    },
};

export default function ContactFormSection() {
    const theme = useTheme();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState<ContactsRequest>({
        name: '',
        email: '',
        orderNumber: '',
        message: '',
        file: undefined,
    });

    useEffect(() => {
        const subject = searchParams.get('subject');
        if (subject) {
            setForm((prev) => ({
                ...prev,
                message: prev.message || `Hi — I have a question about: ${subject}`,
            }));
        }
    }, [searchParams]);

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setForm({ ...form, file: e.target.files[0] });
        }
    };

    const handleRemoveFile = () => {
        setForm({ ...form, file: undefined });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await createContacts(form);
            setSuccess(true);
            setForm({
                name: '',
                email: '',
                orderNumber: '',
                message: '',
                file: undefined,
            });
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', py: { xs: 5, md: 8 } }}>
            <Container maxWidth="sm">
                <Stack spacing={4} alignItems="center">
                    <Box component="h1" sx={{ m: 0, textAlign: 'center', maxWidth: 480 }}>
                        <Typography
                            component="span"
                            sx={{
                                display: 'block',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                lineHeight: 1.15,
                                color: theme.palette.grey[900],
                                mb: 1,
                            }}
                        >
                            Say{' '}
                            <Box
                                component="span"
                                sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    px: { xs: 2, md: 2.5 },
                                    py: { xs: 0.5, md: 0.75 },
                                    mx: 0.5,
                                    fontWeight: 800,
                                    color: BRAND_BLUE,
                                    bgcolor: '#ffffff',
                                    border: `2px solid ${alpha(BRAND_BLUE, 0.15)}`,
                                    outline: `2px dashed ${alpha(BRAND_BLUE, 0.3)}`,
                                    outlineOffset: 3,
                                    borderRadius: 2.5,
                                    transform: 'rotate(-4deg)',
                                    boxShadow: `
                                        4px 4px 0 ${alpha(BRAND_BLUE, 0.15)},
                                        0 8px 20px ${alpha(BRAND_BLUE, 0.12)}
                                    `,
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -6,
                                        right: -6,
                                        width: 14,
                                        height: 14,
                                        bgcolor: alpha(BRAND_BLUE, 0.08),
                                        borderRadius: '0 0 6px 0',
                                        transform: 'rotate(12deg)',
                                    },
                                }}
                            >
                                hello
                            </Box>
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.0625rem' },
                                lineHeight: 1.6,
                            }}
                        >
                            Questions about stickers, orders, or samples? Write to us below.
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ width: '100%' }}
                    >
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                sx={fieldSx}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                sx={fieldSx}
                            />
                            <TextField
                                fullWidth
                                label="Order number (optional)"
                                name="orderNumber"
                                value={form.orderNumber}
                                onChange={handleChange}
                                sx={fieldSx}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                label="Message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                placeholder="Tell us how we can help..."
                                sx={fieldSx}
                            />

                            <Box
                                component="label"
                                sx={{
                                    display: 'block',
                                    cursor: 'pointer',
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 2.5,
                                        border: `2px dashed ${form.file ? BRAND_BLUE : alpha(BRAND_BLUE, 0.25)}`,
                                        bgcolor: form.file
                                            ? alpha(BRAND_BLUE, 0.04)
                                            : alpha(BRAND_BLUE, 0.02),
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: BRAND_BLUE,
                                            bgcolor: alpha(BRAND_BLUE, 0.05),
                                        },
                                    }}
                                >
                                    {form.file ? (
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1.5,
                                                    bgcolor: alpha(BRAND_BLUE, 0.1),
                                                    color: BRAND_BLUE,
                                                }}
                                            >
                                                <InsertDriveFileOutlinedIcon />
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.9375rem',
                                                        color: theme.palette.grey[900],
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {form.file.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Click to replace
                                                </Typography>
                                            </Box>
                                            <Box
                                                component="span"
                                                role="button"
                                                aria-label="Remove file"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemoveFile();
                                                }}
                                                sx={{
                                                    display: 'flex',
                                                    p: 0.5,
                                                    borderRadius: 1,
                                                    color: theme.palette.grey[500],
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.error.main, 0.08),
                                                        color: 'error.main',
                                                    },
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </Box>
                                        </Stack>
                                    ) : (
                                        <Stack alignItems="center" spacing={0.75} sx={{ py: 0.5 }}>
                                            <CloudUploadOutlinedIcon
                                                sx={{ fontSize: 32, color: BRAND_BLUE }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.9375rem',
                                                    color: BRAND_BLUE,
                                                }}
                                            >
                                                Attach a file
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Optional — click to browse
                                            </Typography>
                                        </Stack>
                                    )}
                                </Box>
                                <input type="file" hidden onChange={handleFileChange} />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={submitting}
                                endIcon={submitting ? undefined : <ArrowForwardIcon />}
                                sx={{
                                    mt: 1,
                                    py: 1.6,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    borderRadius: 50,
                                    bgcolor: BRAND_BLUE,
                                    textTransform: 'none',
                                    boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.25)}`,
                                    '&:hover': {
                                        bgcolor: '#124578',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                {submitting ? (
                                    <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                                ) : (
                                    'Send message'
                                )}
                            </Button>

                            {success && (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ pt: 1 }}
                                >
                                    <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
                                        Message sent — we&apos;ll reply soon!
                                    </Typography>
                                </Stack>
                            )}

                            {error && (
                                <Typography variant="body2" color="error" textAlign="center" sx={{ pt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
