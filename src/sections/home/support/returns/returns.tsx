import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from '../../../../routes/hooks';

const BRAND_BLUE = '#175195';

const SECTIONS = [
    {
        icon: ReplayOutlinedIcon,
        title: 'Problems with your order?',
        paragraphs: [
            'If you have a problem with your order, please let us know within 30 days of receiving your products. We will be unable to replace or refund any orders brought to our attention after 30 days of confirmed delivery by USPS or UPS.',
            'Every order we produce is 100% custom. We do not allow returns or refunds for reasons unrelated to quality — for example, we will not refund your order if you decide you do not want it, ordered the wrong size, or prefer a different product. If the mistake is on our end, we will fix it and make it right.',
            'If your order has an issue due to setup, printing, laminating, or packaging, let us know. We will look into the issue and, if needed, reprint your order. Refunds will not be given for these issues — only reprints.',
            'If you feel there was an error in print quality, we are happy to look into it. Screen colors can differ from printed output due to brightness, contrast, and color variables. If we reprint your order, we may ask for a photo or further instructions so we can get it right.',
        ],
    },
    {
        icon: VerifiedOutlinedIcon,
        title: 'Refunds',
        paragraphs: [
            'We will process your refund request within 2 business days. Once we submit a refund to your bank or credit card company, it can take up to 4 business days to see the credit on your statement. This usually depends on the policies of your bank or credit card company.',
            'If you have not received a refund yet, contact your bank or credit card company — they should be able to answer questions about any delay.',
        ],
    },
    {
        icon: ShieldOutlinedIcon,
        title: 'Our guarantee',
        paragraphs: [
            'We stand behind our products, our process, and our print quality. We do not assume liability for lost sales, labor costs, or other costs associated with your order if there are issues, but we will reprint your order and cover shipping when quality is at fault.',
            'While we guarantee the quality of our prints, shipping times are not guaranteed since we use USPS and UPS.',
            'We appreciate your business and thank you for choosing Complete Graphics Sticker House. We hope to print another order for you soon!',
        ],
    },
] as const;

export default function Returns() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <Box sx={{ bgcolor: '#ffffff', pb: { xs: 6, md: 8 } }}>
            <Box sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 4 } }}>
                <Container maxWidth="md">
                    <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Box component="h1" sx={{ m: 0, maxWidth: 540 }}>
                            <Typography
                                component="span"
                                sx={{
                                    display: 'block',
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    lineHeight: 1.15,
                                    color: theme.palette.grey[900],
                                    mb: 1.5,
                                }}
                            >
                                Returns & refunds
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '1rem', md: '1.0625rem' },
                                    lineHeight: 1.65,
                                }}
                            >
                                Custom stickers are made to order. Here is how we handle order
                                issues, reprints, and refunds.
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md">
                <Stack spacing={3}>
                    <Box
                        sx={{
                            p: { xs: 2.5, md: 3 },
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                            bgcolor: alpha(BRAND_BLUE, 0.04),
                            border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2,
                                    bgcolor: alpha(BRAND_BLUE, 0.1),
                                    color: BRAND_BLUE,
                                }}
                            >
                                <EmailOutlinedIcon />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, color: theme.palette.grey[900] }}>
                                    Need help with an order?
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    support@cgstickerhouse.com
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => router.push('/contact-us')}
                            sx={{
                                flexShrink: 0,
                                px: 3,
                                py: 1.25,
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                borderRadius: 50,
                                bgcolor: BRAND_BLUE,
                                textTransform: 'none',
                                boxShadow: `0 6px 20px ${alpha(BRAND_BLUE, 0.22)}`,
                                '&:hover': { bgcolor: '#124578' },
                            }}
                        >
                            Contact us
                        </Button>
                    </Box>

                    {SECTIONS.map(({ icon: Icon, title, paragraphs }) => (
                        <Box
                            key={title}
                            sx={{
                                p: { xs: 2.5, md: 3.5 },
                                borderRadius: 3,
                                bgcolor: '#ffffff',
                                border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                                boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.05)}`,
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        bgcolor: alpha(BRAND_BLUE, 0.08),
                                        color: BRAND_BLUE,
                                    }}
                                >
                                    <Icon sx={{ fontSize: 22 }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '1.125rem',
                                        color: theme.palette.grey[900],
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {title}
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                {paragraphs.map((text) => (
                                    <Typography
                                        key={text.slice(0, 40)}
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '0.9375rem',
                                            lineHeight: 1.75,
                                        }}
                                    >
                                        {text}
                                    </Typography>
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}
