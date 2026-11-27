import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const BRAND_BLUE = '#175195';

export default function BlogTitle() {
    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: '#ffffff', pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 4 } }}>
            <Container maxWidth="md">
                <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: BRAND_BLUE,
                        }}
                    >
                        From Mule Chess
                    </Typography>
                    <Box component="h1" sx={{ m: 0, maxWidth: 540 }}>
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
                            Tips, ideas & inspiration
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.0625rem' },
                                lineHeight: 1.65,
                            }}
                        >
                            Guides on design, marketing, and getting the most from your custom
                            stickers.
                        </Typography>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
