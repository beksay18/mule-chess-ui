import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

const BRAND_BLUE = '#175195';

const stickerChipSx = {
    position: 'relative' as const,
    display: 'inline-block',
    px: { xs: 2, md: 2.5 },
    py: { xs: 0.5, md: 0.75 },
    mx: 0.5,
    fontWeight: 800,
    color: BRAND_BLUE,
    border: `2px dashed ${alpha(BRAND_BLUE, 0.3)}`,
    borderRadius: 2.5,
    transform: 'rotate(-2deg)',
};

export type LegalSection = {
    title: string;
    paragraphs: string[];
};

type LegalPageProps = {
    headline: string;
    chip: string;
    subtitle: string;
    sections: LegalSection[];
};

export default function LegalPage({
    headline,
    chip,
    subtitle,
    sections,
}: LegalPageProps) {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: '#ffffff', pb: { xs: 6, md: 8 } }}>
            <Box sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 4 } }}>
                <Container maxWidth="md">
                    <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Box component="h1" sx={{ m: 0, maxWidth: 560 }}>
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
                                {headline}{' '}
                                <Box component="span" sx={stickerChipSx}>
                                    {chip}
                                </Box>
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '1rem', md: '1.0625rem' },
                                    lineHeight: 1.65,
                                }}
                            >
                                {subtitle}
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md">
                <Stack spacing={3}>
                    {sections.map((section) => (
                        <Box
                            key={section.title}
                            sx={{
                                p: { xs: 2.5, md: 3.5 },
                                borderRadius: 3,
                                bgcolor: '#ffffff',
                                border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                                boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.05)}`,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '1.0625rem',
                                    color: BRAND_BLUE,
                                    mb: 2,
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Stack spacing={2}>
                                {section.paragraphs.map((text) => (
                                    <Typography
                                        key={text.slice(0, 48)}
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
