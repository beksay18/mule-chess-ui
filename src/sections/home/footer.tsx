import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';

const BRAND_BLUE = '#175195';
const FOOTER_DARK = '#0c1f35';
const FOOTER_DARKER = '#081628';

const linkSx = {
    color: alpha('#ffffff', 0.65),
    fontSize: '0.875rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
        color: '#ffffff',
    },
};

const sectionTitleSx = {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.8125rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    mb: 0.5,
};

export default function Footer() {
    const logoImage = '/assets/images/home-products/cg-sticker-house.png';

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: FOOTER_DARK,
                backgroundImage: `linear-gradient(180deg, ${FOOTER_DARK} 0%, ${FOOTER_DARKER} 100%)`,
                borderTop: `1px solid ${alpha('#ffffff', 0.08)}`,
            }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '2fr 1fr 1fr',
                        },
                        gap: { xs: 4, md: 6 },
                    }}
                >
                    <Stack spacing={2.5} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Stack spacing={1.5} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}>
                            <Box
                                component="a"
                                href="/"
                                sx={{
                                    display: 'inline-flex',
                                    textDecoration: 'none',
                                    transition: 'opacity 0.2s ease',
                                    '&:hover': { opacity: 0.88 },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={logoImage}
                                    alt="CG Stickers"
                                    sx={{
                                        height: { xs: 44, md: 52 },
                                        width: 'auto',
                                        maxWidth: { xs: 200, md: 240 },
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </Box>

                            <Box sx={{ maxWidth: 300, textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography
                                    sx={{
                                        color: alpha('#ffffff', 0.85),
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        lineHeight: 1.65,
                                        mb: 0.75,
                                    }}
                                >
                                    Design online and we&apos;ll handle the rest.
                                </Typography>
                                <Typography
                                    sx={{
                                        color: alpha('#ffffff', 0.5),
                                        fontSize: '0.875rem',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Custom stickers printed with care.
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
                        >
                            {[InstagramIcon, YouTubeIcon, FacebookIcon].map((Icon, index) => (
                                <IconButton
                                    key={index}
                                    href="#"
                                    aria-label="Social link"
                                    sx={{
                                        color: alpha('#ffffff', 0.55),
                                        '&:hover': {
                                            color: '#ffffff',
                                            bgcolor: alpha(BRAND_BLUE, 0.35),
                                        },
                                    }}
                                >
                                    <Icon />
                                </IconButton>
                            ))}
                        </Stack>
                    </Stack>

                    <Stack spacing={1.25} sx={{ alignItems: { xs: 'center', sm: 'flex-start' } }}>
                        <Typography sx={sectionTitleSx}>Company</Typography>
                        <Link href="/about-us" sx={linkSx}>
                            About us
                        </Link>
                        <Link href="/blog" sx={linkSx}>
                            Blog
                        </Link>
                        <Link href="/contact-us" sx={linkSx}>
                            Contact us
                        </Link>
                    </Stack>

                    <Stack spacing={1.25} sx={{ alignItems: { xs: 'center', sm: 'flex-start' } }}>
                        <Typography sx={sectionTitleSx}>Support</Typography>
                        <Link href="/help" sx={linkSx}>
                            Help
                        </Link>
                        <Link href="/returns" sx={linkSx}>
                            Returns
                        </Link>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        mt: { xs: 5, md: 6 },
                        pt: 3,
                        borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1.5,
                        textAlign: { xs: 'center', sm: 'left' },
                    }}
                >
                    <Typography sx={{ color: alpha('#ffffff', 0.5), fontSize: '0.8125rem' }}>
                        © {new Date().getFullYear()} Complete Graphics. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Link href="/privacy" sx={{ ...linkSx, fontSize: '0.8125rem' }}>
                            Privacy
                        </Link>
                        <Link href="/terms" sx={{ ...linkSx, fontSize: '0.8125rem' }}>
                            Terms
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
