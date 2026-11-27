import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha, useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';
import { useRouter } from '../../routes/hooks';
import { DateBadge } from '../chess/date-badge';
import { isPast, feeRange, isHappening, locationLabel, formatShortRange } from '../chess/format';
import { useChessState } from '../chess/store';

const BRAND_BLUE = '#175195';
const MARK = '#2888A0';

const STEPS = [
    { title: 'Find a tournament', text: 'Search by date, city, and section.' },
    { title: 'Reserve a seat', text: 'Pick an open section and confirm the entry.' },
    { title: 'Show up on the list', text: 'Your name is on the entry list before round one.' },
] as const;

export default function HomeOverview() {
    const router = useRouter();
    const theme = useTheme();
    const chess = useChessState();
    const upcoming = chess.tournaments
        .filter((tournament) => !isPast(tournament))
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, 4);

    return (
        <Box sx={{ bgcolor: '#ffffff' }}>
            <Box
                id="hero"
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(180deg, ${alpha(MARK, 0.08)} 0%, #ffffff 58%)`,
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 6, md: 9 }, pb: { xs: 5, md: 7 } }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
                            alignItems: 'center',
                            gap: { xs: 4, md: 6 },
                        }}
                    >
                        <Stack spacing={3} sx={{ maxWidth: 620 }}>
                            <Typography sx={{ color: MARK, fontWeight: 800, letterSpacing: 1.4, fontSize: 13, textTransform: 'uppercase' }}>
                                Tournament registration
                            </Typography>
                            <Typography
                                component="h1"
                                sx={{
                                    m: 0,
                                    fontWeight: 800,
                                    letterSpacing: '-0.045em',
                                    fontSize: { xs: '2.4rem', sm: '3.1rem', md: '3.6rem' },
                                    lineHeight: 1.02,
                                    color: theme.palette.grey[900],
                                }}
                            >
                                Find your next tournament and reserve a seat.
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '1.05rem', md: '1.15rem' }, lineHeight: 1.7, maxWidth: 520 }}>
                                Open, scholastic, and team sections each have their own fee and capacity. Register in a few minutes and your name is on the entry list.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => router.push('/tournaments')}
                                    sx={{
                                        px: 3.5,
                                        py: 1.4,
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        borderRadius: 2.5,
                                        bgcolor: BRAND_BLUE,
                                        textTransform: 'none',
                                        boxShadow: `0 10px 24px ${alpha(BRAND_BLUE, 0.24)}`,
                                        '&:hover': { bgcolor: '#124578' },
                                    }}
                                >
                                    Browse tournaments
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => router.push('/sign-up')}
                                    sx={{
                                        px: 3.5,
                                        py: 1.4,
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        borderRadius: 2.5,
                                        color: BRAND_BLUE,
                                        borderColor: alpha(BRAND_BLUE, 0.35),
                                        textTransform: 'none',
                                        '&:hover': { borderColor: BRAND_BLUE, bgcolor: alpha(BRAND_BLUE, 0.04) },
                                    }}
                                >
                                    Create account
                                </Button>
                            </Stack>
                        </Stack>

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box
                                sx={{
                                    width: { xs: 280, md: 420 },
                                    height: { xs: 320, md: 460 },
                                    borderRadius: '50%',
                                    bgcolor: alpha(MARK, 0.12),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/assets/images/mule-chess-logo.png"
                                    alt="Mule Chess"
                                    sx={{ height: '78%', width: 'auto', objectFit: 'contain', display: 'block' }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: { xs: 5, md: 7 },
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                            gap: 2,
                        }}
                    >
                        {STEPS.map((step, index) => (
                            <Box
                                key={step.title}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    bgcolor: '#fff',
                                    border: `1px solid ${alpha(MARK, 0.18)}`,
                                }}
                            >
                                <Typography sx={{ color: MARK, fontWeight: 800, fontSize: 13, letterSpacing: 0.6 }}>
                                    0{index + 1}
                                </Typography>
                                <Typography sx={{ mt: 0.75, fontWeight: 800 }}>{step.title}</Typography>
                                <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                    {step.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            <Box id="upcoming" sx={{ bgcolor: '#f6f8fb', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="lg">
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.875rem' }, letterSpacing: '-0.03em' }}>
                            Upcoming tournaments
                        </Typography>
                        <Button component={RouterLink} href="/tournaments" sx={{ fontWeight: 700, textTransform: 'none', color: BRAND_BLUE }}>
                            See all
                        </Button>
                    </Stack>
                    <Stack spacing={1.5}>
                        {upcoming.map((tournament) => (
                            <Stack
                                key={tournament.id}
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                sx={{
                                    alignItems: { sm: 'center' },
                                    p: 1.5,
                                    bgcolor: '#fff',
                                    borderRadius: 3,
                                    border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 28px ${alpha(BRAND_BLUE, 0.08)}` },
                                }}
                            >
                                <DateBadge startDate={tournament.startDate} endDate={tournament.endDate} />
                                <Stack sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        component={RouterLink}
                                        href={`/tournaments/${tournament.slug}`}
                                        sx={{ fontWeight: 800, color: BRAND_BLUE, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        {tournament.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {tournament.organizer} · {locationLabel(tournament)} · {formatShortRange(tournament)}
                                        {isHappening(tournament) ? ' · Happening now' : ''}
                                    </Typography>
                                </Stack>
                                <Typography sx={{ fontWeight: 800, minWidth: 72 }}>{feeRange(tournament)}</Typography>
                                <Button
                                    component={RouterLink}
                                    href={`/register/${tournament.slug}`}
                                    variant="contained"
                                    sx={{ bgcolor: BRAND_BLUE, textTransform: 'none', fontWeight: 700, borderRadius: 2, '&:hover': { bgcolor: '#124578' } }}
                                >
                                    Register
                                </Button>
                            </Stack>
                        ))}
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
