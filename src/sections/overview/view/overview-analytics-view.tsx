import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentUser } from '../../../api';
import { getMonthlyOrderReport, getOrderStatusCount, MonthlyOrderReport, OrderStatusCount } from '../../../api/order';
import { useRouter } from '../../../routes/hooks';
import { MonthlyReport } from '../monthly-report';

const STATUS_CARDS = [
    { status: 'NEW', label: 'New', bg: '#e7f6fb', color: '#0e7490' },
    { status: 'IN_PROGRESS', label: 'In progress', bg: '#f3e8ff', color: '#6b21a8' },
    { status: 'READY_TO_SHIP', label: 'Ready to ship', bg: '#fef3c7', color: '#92400e' },
    { status: 'SHIPPED', label: 'Shipped', bg: '#dcfce7', color: '#166534' },
    { status: 'CANCELLED', label: 'Cancelled', bg: '#fee2e2', color: '#991b1b' },
] as const;

const cardSx = {
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'grey.200',
    boxShadow: 'none',
};

export function OverviewAnalyticsView() {
    const router = useRouter();
    const user = getCurrentUser();
    const [statusCounts, setStatusCounts] = useState<OrderStatusCount[]>([]);
    const [monthlyReport, setMonthlyReport] = useState<MonthlyOrderReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [counts, report] = await Promise.all([
                    getOrderStatusCount(),
                    getMonthlyOrderReport(),
                ]);
                setStatusCounts(counts);
                setMonthlyReport(report);
            } catch (error) {
                console.error('Failed to load dashboard', error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const countFor = (status: string) =>
        statusCounts.find((item) => item.status === status)?.count ?? 0;

    const newCount = countFor('NEW');
    const firstName = user?.person?.firstName ?? '';
    const lastName = user?.person?.lastName ?? '';
    const displayName = `${firstName} ${lastName}`.trim();

    const openStatus = (status: string) => {
        router.push(`/orders?page=0&filter=${encodeURIComponent(`orderStatus:${status}`)}`);
    };

    return (
        <DashboardContent maxWidth="xl">
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'flex-end' }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        component="h1"
                        sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.75rem' }, letterSpacing: '-0.02em' }}
                    >
                        {displayName ? `Hi, ${displayName}` : 'Dashboard'}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {newCount > 0
                            ? `${newCount} new ${newCount === 1 ? 'order is' : 'orders are'} waiting to be processed.`
                            : 'Orders are up to date.'}
                    </Typography>
                </Box>
                <Typography
                    component="button"
                    onClick={() => router.push('/orders')}
                    sx={{
                        border: 0,
                        p: 0,
                        bgcolor: 'transparent',
                        color: 'primary.main',
                        fontWeight: 700,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                    }}
                >
                    View all orders
                </Typography>
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                        xs: '1fr 1fr',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(5, 1fr)',
                    },
                    mb: 3,
                }}
            >
                {STATUS_CARDS.map((card) => (
                    <Box
                        key={card.status}
                        component="button"
                        onClick={() => openStatus(card.status)}
                        sx={{
                            ...cardSx,
                            p: 2,
                            textAlign: 'left',
                            cursor: 'pointer',
                            bgcolor: card.bg,
                            color: card.color,
                            borderColor: 'transparent',
                            '&:hover': { transform: 'translateY(-1px)' },
                        }}
                    >
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em' }}>
                            {card.label.toUpperCase()}
                        </Typography>
                        <Typography sx={{ mt: 1, fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>
                            {loading ? '—' : countFor(card.status)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <MonthlyReport rows={monthlyReport} loading={loading} />
        </DashboardContent>
    );
}
