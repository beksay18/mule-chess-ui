import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { getCurrentUser } from '../../../api';
import { getAllOrders, getOrderStatusCount, OrderContent, OrderStatusCount } from '../../../api/order';
import { useRouter } from '../../../routes/hooks';

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

const formatWhen = (value: string) =>
    new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

const statusLabel = (status: string) =>
    STATUS_CARDS.find((card) => card.status === status)?.label ?? status.replace(/_/g, ' ');

const statusColor = (status: string) =>
    STATUS_CARDS.find((card) => card.status === status)?.color ?? '#334155';

export function OverviewAnalyticsView() {
    const router = useRouter();
    const user = getCurrentUser();
    const [statusCounts, setStatusCounts] = useState<OrderStatusCount[]>([]);
    const [recentOrders, setRecentOrders] = useState<OrderContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [counts, orders] = await Promise.all([
                    getOrderStatusCount(),
                    getAllOrders({ page: 0, size: 6 }),
                ]);
                setStatusCounts(counts);
                setRecentOrders(orders.content ?? []);
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

            <Paper elevation={0} sx={{ ...cardSx, overflow: 'hidden' }}>
                <Box sx={{ px: 2.5, py: 2 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Recent orders</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Latest orders across every status.
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : recentOrders.length === 0 ? (
                    <Typography color="text.secondary" sx={{ px: 2.5, pb: 3 }}>
                        No orders yet.
                    </Typography>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="medium">
                            <TableHead>
                                <TableRow>
                                    {['Order', 'Customer', 'Ship to', 'Total', 'Status', 'Placed'].map((heading) => (
                                        <TableCell
                                            key={heading}
                                            sx={{ color: 'text.secondary', fontWeight: 700, borderColor: 'grey.100' }}
                                        >
                                            {heading}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow
                                        key={order.orderId}
                                        hover
                                        onClick={() => router.push(`/order-details/${order.orderId}`)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell sx={{ fontWeight: 800 }}>#{order.orderNumber}</TableCell>
                                        <TableCell>
                                            {order.customerFirstName} {order.customerLastName}
                                        </TableCell>
                                        <TableCell>
                                            {[order.city, order.state].filter(Boolean).join(', ') || '—'}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            ${Number(order.totalAmount).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={statusLabel(order.orderStatus)}
                                                sx={{
                                                    fontWeight: 700,
                                                    color: statusColor(order.orderStatus),
                                                    bgcolor: `${statusColor(order.orderStatus)}14`,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                            {formatWhen(order.dateCreated)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Paper>
        </DashboardContent>
    );
}
