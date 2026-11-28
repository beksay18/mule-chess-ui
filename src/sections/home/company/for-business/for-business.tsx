import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from '../../../../routes/hooks';

const BRAND_BLUE = '#175195';
const SUPPORT_EMAIL = 'support@cgstickerhouse.com';

const BENEFITS = [
    {
        icon: Inventory2OutlinedIcon,
        title: 'Volume-friendly ordering',
        desc: 'Order the quantities your business needs — from launch runs to ongoing replenishment.',
    },
    {
        icon: LocalOfferOutlinedIcon,
        title: 'Consistent brand quality',
        desc: 'Crisp color, durable materials, and reliable results every time you reorder.',
    },
    {
        icon: RocketLaunchOutlinedIcon,
        title: 'Fast turnaround',
        desc: 'Streamlined production so your stickers ship when your campaigns and launches need them.',
    },
    {
        icon: SupportAgentOutlinedIcon,
        title: 'Dedicated support',
        desc: 'Reach our team at support@cgstickerhouse.com for quotes, reorders, and order help.',
    },
] as const;

const USE_CASES = [
    {
        icon: StorefrontOutlinedIcon,
        title: 'Retail & packaging',
        desc: 'Product labels, seal stickers, and branded packaging that makes unboxing memorable.',
    },
    {
        icon: CampaignOutlinedIcon,
        title: 'Marketing & events',
        desc: 'Promo stickers, giveaways, and event swag that spread your brand offline.',
    },
    {
        icon: GroupsOutlinedIcon,
        title: 'Teams & organizations',
        desc: 'Uniform branding for staff, members, fundraisers, and community programs.',
    },
    {
        icon: BusinessCenterOutlinedIcon,
        title: 'Agencies & resellers',
        desc: 'Reliable sticker production for client campaigns with a partner you can count on.',
    },
] as const;

const STEPS = [
    {
        step: '01',
        title: 'Share your project',
        desc: 'Tell us what you need — sizes, quantities, finishes, and timeline.',
    },
    {
        step: '02',
        title: 'Upload your artwork',
        desc: 'Send your files and we will print them for your campaign.',
    },
    {
        step: '03',
        title: 'Approve & print',
        desc: 'We produce your order with care and ship directly to you.',
    },
] as const;

export default function ForBusiness() {
    const theme = useTheme();
    const router = useRouter();

    const scrollToHomeProducts = () => {
        router.push('/');
        setTimeout(() => {
            document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <Box sx={{ bgcolor: '#ffffff' }}>
            <Box sx={{ py: { xs: 5, md: 8 } }}>
                <Container maxWidth="md">
                    <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Box component="h1" sx={{ m: 0, maxWidth: 620 }}>
                            <Typography
                                component="span"
                                sx={{
                                    display: 'block',
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    fontSize: { xs: '2rem', md: '2.75rem' },
                                    lineHeight: 1.15,
                                    color: theme.palette.grey[900],
                                    mb: 1.5,
                                }}
                            >
                                Stickers that scale with your business
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    lineHeight: 1.7,
                                    maxWidth: 560,
                                    mx: 'auto',
                                }}
                            >
                                Complete Graphics Sticker House helps brands, retailers, and teams
                                order custom stickers online — with the quality and consistency
                                growing businesses depend on.
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Box
                sx={{
                    py: { xs: 5, md: 7 },
                    bgcolor: alpha(BRAND_BLUE, 0.03),
                    borderTop: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                    borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.375rem', md: '1.5rem' },
                            color: theme.palette.grey[900],
                            textAlign: 'center',
                            mb: { xs: 4, md: 5 },
                        }}
                    >
                        Why businesses choose us
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
                            gap: { xs: 2.5, md: 3 },
                        }}
                    >
                        {BENEFITS.map(({ icon: Icon, title, desc }) => (
                            <Box
                                key={title}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: '#ffffff',
                                    border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                                    boxShadow: `0 4px 20px ${alpha(BRAND_BLUE, 0.06)}`,
                                    height: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        bgcolor: alpha(BRAND_BLUE, 0.08),
                                        color: BRAND_BLUE,
                                        mb: 2,
                                    }}
                                >
                                    <Icon sx={{ fontSize: 24 }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.0625rem',
                                        color: theme.palette.grey[900],
                                        mb: 0.75,
                                    }}
                                >
                                    {title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                                >
                                    {desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 6, md: 8 } }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            gap: { xs: 5, md: 8 },
                        }}
                    >
                        <Stack spacing={3} sx={{ flex: 1.2 }}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '1.375rem', md: '1.5rem' },
                                        color: theme.palette.grey[900],
                                        mb: 1,
                                    }}
                                >
                                    Built for real-world use
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                                    Whether you are launching a product line, running a promotion,
                                    or outfitting a storefront, we make it easy to get professional
                                    stickers without the back-and-forth of traditional print shops.
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                    gap: 2,
                                }}
                            >
                                {USE_CASES.map(({ icon: Icon, title, desc }) => (
                                    <Box
                                        key={title}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 2.5,
                                            border: `1px solid ${theme.palette.grey[200]}`,
                                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                borderColor: alpha(BRAND_BLUE, 0.25),
                                                boxShadow: `0 4px 16px ${alpha(BRAND_BLUE, 0.08)}`,
                                            },
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1.5,
                                                    bgcolor: alpha(BRAND_BLUE, 0.08),
                                                    color: BRAND_BLUE,
                                                }}
                                            >
                                                <Icon sx={{ fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 700,
                                                        fontSize: '0.9375rem',
                                                        color: theme.palette.grey[900],
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'text.secondary', lineHeight: 1.65 }}
                                                >
                                                    {desc}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                ))}
                            </Box>
                        </Stack>

                        <Box
                            sx={{
                                flex: 1,
                                width: '100%',
                                maxWidth: { md: 400 },
                                mx: { xs: 'auto', md: 0 },
                            }}
                        >
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: -14,
                                        borderRadius: 4,
                                        border: `2px dashed ${alpha(BRAND_BLUE, 0.2)}`,
                                        transform: 'rotate(3deg)',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <Box
                                    component="img"
                                    src="/assets/images/mule-chess-logo.png"
                                    alt="Mule Chess"
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        maxHeight: 360,
                                        objectFit: 'contain',
                                        display: 'block',
                                        filter: `drop-shadow(0 18px 28px ${alpha(BRAND_BLUE, 0.28)})`,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box
                sx={{
                    py: { xs: 5, md: 7 },
                    bgcolor: alpha(BRAND_BLUE, 0.03),
                    borderTop: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.375rem', md: '1.5rem' },
                            color: theme.palette.grey[900],
                            textAlign: 'center',
                            mb: { xs: 4, md: 5 },
                        }}
                    >
                        How it works
                    </Typography>

                    <Stack spacing={2.5}>
                        {STEPS.map(({ step, title, desc }) => (
                            <Box
                                key={step}
                                sx={{
                                    display: 'flex',
                                    gap: 2.5,
                                    p: 2.5,
                                    borderRadius: 2.5,
                                    bgcolor: '#ffffff',
                                    border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                                }}
                            >
                                <Typography
                                    sx={{
                                        flexShrink: 0,
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        color: alpha(BRAND_BLUE, 0.35),
                                        lineHeight: 1,
                                        pt: 0.25,
                                    }}
                                >
                                    {step}
                                </Typography>
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '1.0625rem',
                                            color: theme.palette.grey[900],
                                            mb: 0.5,
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                                    >
                                        {desc}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 5, md: 7 } }}>
                <Container maxWidth="sm">
                    <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.375rem', md: '1.625rem' },
                                color: theme.palette.grey[900],
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Ready to order for your business?
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                            Start online today or reach out for help with larger runs, recurring
                            orders, or custom requirements.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                endIcon={<ArrowForwardIcon />}
                                onClick={scrollToHomeProducts}
                                sx={{
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
                                Shop stickers
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                startIcon={<EmailOutlinedIcon />}
                                href={`mailto:${SUPPORT_EMAIL}`}
                                sx={{
                                    py: 1.6,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    borderRadius: 50,
                                    color: BRAND_BLUE,
                                    borderColor: alpha(BRAND_BLUE, 0.3),
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: BRAND_BLUE,
                                        bgcolor: alpha(BRAND_BLUE, 0.04),
                                    },
                                }}
                            >
                                Email us
                            </Button>
                        </Stack>
                        <Button
                            onClick={() => router.push('/contact-us')}
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.9375rem',
                                color: BRAND_BLUE,
                                textTransform: 'none',
                            }}
                        >
                            Or send a message through our contact form
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
