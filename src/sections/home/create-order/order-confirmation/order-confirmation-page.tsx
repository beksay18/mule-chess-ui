import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';

import { getCurrentUser } from '../../../../api';
import { useRouter } from '../../../../routes/hooks';

const BRAND_BLUE = '#175195';
const SUCCESS_GREEN = '#15803d';

const NEXT_STEPS = [
    {
        icon: MarkEmailReadOutlinedIcon,
        title: 'Receipt sent',
        body: 'Check your inbox for the order confirmation.',
    },
    {
        icon: PrintOutlinedIcon,
        title: 'In production',
        body: 'We print your stickers and prepare them to ship.',
    },
    {
        icon: LocalShippingOutlinedIcon,
        title: 'Shipping update',
        body: 'We will email you when the order is on the way.',
    },
];

export default function OrderConfirmationPage() {
    const router = useRouter();
    const user = getCurrentUser();
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');

    return (
        <Box sx={{ width: '100%', bgcolor: '#f8fafc', py: { xs: 5, md: 8 } }}>
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                        boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.05)}`,
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: 76,
                            height: 76,
                            mx: 'auto',
                            mb: 2.5,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(SUCCESS_GREEN, 0.1),
                        }}
                    >
                        <CheckCircleOutlineIcon sx={{ fontSize: 42, color: SUCCESS_GREEN }} />
                    </Box>

                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.75rem', md: '2rem' },
                            letterSpacing: '-0.03em',
                            color: '#0f172a',
                        }}
                    >
                        Order confirmed
                    </Typography>
                    <Typography
                        sx={{
                            mt: 1,
                            mx: 'auto',
                            maxWidth: 460,
                            color: 'text.secondary',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                        }}
                    >
                        Payment went through. A receipt is on its way, and we will write again when
                        the order ships.
                    </Typography>

                    <Box
                        sx={{
                            mt: 3,
                            mx: 'auto',
                            maxWidth: 360,
                            px: 2.5,
                            py: 2,
                            borderRadius: 2,
                            bgcolor: alpha(BRAND_BLUE, 0.06),
                            border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: BRAND_BLUE,
                            }}
                        >
                            Order number
                        </Typography>
                        <Typography
                            sx={{
                                mt: 0.5,
                                fontWeight: 800,
                                fontSize: { xs: '1.5rem', md: '1.75rem' },
                                letterSpacing: '0.04em',
                                color: '#0f172a',
                            }}
                        >
                            {orderNumber ? `#${orderNumber}` : 'In your email'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            mt: 4,
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                            gap: 2,
                            textAlign: 'left',
                        }}
                    >
                        {NEXT_STEPS.map((step) => {
                            const Icon = step.icon;
                            return (
                                <Box
                                    key={step.title}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: '#f8fafc',
                                        border: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                                    }}
                                >
                                    <Icon sx={{ color: BRAND_BLUE, fontSize: 26, mb: 1 }} />
                                    <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.5 }}>
                                        {step.body}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        justifyContent="center"
                        sx={{ mt: 4 }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/')}
                            sx={{
                                px: 3,
                                py: 1.3,
                                borderRadius: 50,
                                fontWeight: 800,
                                textTransform: 'none',
                                bgcolor: BRAND_BLUE,
                                boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.28)}`,
                                '&:hover': { bgcolor: '#124578' },
                            }}
                        >
                            Continue shopping
                        </Button>
                        {user?.userId && (
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => router.push('/my-orders')}
                                sx={{
                                    px: 3,
                                    py: 1.3,
                                    borderRadius: 50,
                                    fontWeight: 800,
                                    textTransform: 'none',
                                    color: BRAND_BLUE,
                                    borderColor: alpha(BRAND_BLUE, 0.35),
                                    '&:hover': {
                                        borderColor: BRAND_BLUE,
                                        bgcolor: alpha(BRAND_BLUE, 0.04),
                                    },
                                }}
                            >
                                View my orders
                            </Button>
                        )}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
