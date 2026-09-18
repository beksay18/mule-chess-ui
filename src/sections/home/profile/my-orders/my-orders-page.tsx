import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { getCurrentUser } from '../../../../api';
import { getMyOrders, MyOrderResponsePage } from '../../../../api/order';

const BRAND_BLUE = '#175195';

const STATUS_STYLES: Record<string, { label: string; bgcolor: string; color: string }> = {
    NEW: { label: 'New', bgcolor: alpha('#2196f3', 0.12), color: '#1565c0' },
    IN_PROGRESS: { label: 'In progress', bgcolor: alpha('#ff9800', 0.12), color: '#e65100' },
    READY_TO_SHIP: { label: 'Ready to ship', bgcolor: alpha('#9c27b0', 0.12), color: '#7b1fa2' },
    SHIPPED: { label: 'Shipped', bgcolor: alpha(BRAND_BLUE, 0.12), color: BRAND_BLUE },
    DELIVERED: { label: 'Delivered', bgcolor: alpha('#4caf50', 0.12), color: '#2e7d32' },
    CANCELLED: { label: 'Cancelled', bgcolor: alpha('#f44336', 0.12), color: '#c62828' },
};

function getStatusStyle(status: string) {
    return (
        STATUS_STYLES[status] ?? {
            label: status.replace(/_/g, ' ').toLowerCase(),
            bgcolor: alpha(BRAND_BLUE, 0.08),
            color: BRAND_BLUE,
        }
    );
}

function formatOrderDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function MyOrdersPage() {
    const theme = useTheme();
    const user = getCurrentUser();
    const [orders, setOrders] = useState<MyOrderResponsePage | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const baseImageUrl = import.meta.env.VITE_API_BASE_IMAGE_URL;

    const fetchOrders = async (currentPage: number) => {
        setLoading(true);
        try {
            const result = await getMyOrders({
                page: currentPage - 1,
                size: pageSize,
                userId: user?.userId,
            });
            setOrders(result);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [page, user?.userId]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Stack spacing={3} sx={{ width: '100%' }}>
            <Box>
                <Typography
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.375rem', md: '1.5rem' },
                        letterSpacing: '-0.02em',
                        color: theme.palette.grey[900],
                        mb: 0.5,
                    }}
                >
                    My orders
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                    View your sticker orders and track their status.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: BRAND_BLUE }} />
                </Box>
            ) : orders?.content?.length ? (
                <Stack spacing={2.5}>
                    {orders.content.map((order) => {
                        const status = getStatusStyle(order.orderStatus);

                        return (
                            <Box
                                key={order.orderNumber}
                                sx={{
                                    borderRadius: 2.5,
                                    border: `1px solid ${theme.palette.grey[200]}`,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        px: 2.5,
                                        py: 2,
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        gap: 1.5,
                                        bgcolor: alpha(BRAND_BLUE, 0.03),
                                        borderBottom: `1px solid ${theme.palette.grey[100]}`,
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.9375rem',
                                                color: theme.palette.grey[900],
                                            }}
                                        >
                                            Order #{order.orderNumber}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary', mt: 0.25 }}
                                        >
                                            {formatOrderDate(order.dateCreated)}
                                        </Typography>
                                    </Box>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1.5}
                                        sx={{ flexShrink: 0 }}
                                    >
                                        <Chip
                                            label={status.label}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                                bgcolor: status.bgcolor,
                                                color: status.color,
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                color: BRAND_BLUE,
                                            }}
                                        >
                                            ${order.totalAmount.toFixed(2)}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Stack spacing={0} sx={{ px: 2.5, py: 1 }}>
                                    {order.lineItems.map((item, index) => (
                                        <Box
                                            key={`${order.orderNumber}-${index}`}
                                            sx={{
                                                py: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                borderBottom:
                                                    index < order.lineItems.length - 1
                                                        ? `1px solid ${theme.palette.grey[100]}`
                                                        : 'none',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    flexShrink: 0,
                                                    borderRadius: 1.5,
                                                    bgcolor: theme.palette.grey[50],
                                                    border: `1px solid ${theme.palette.grey[200]}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {item.imageUrl ? (
                                                    <Box
                                                        component="img"
                                                        src={`${baseImageUrl}${item.imageUrl}`}
                                                        alt={item.productName}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'contain',
                                                        }}
                                                    />
                                                ) : null}
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.9375rem',
                                                        color: theme.palette.grey[900],
                                                    }}
                                                >
                                                    {item.productName}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'text.secondary', mt: 0.25 }}
                                                >
                                                    Qty {item.quantity} · {item.width}&quot; ×{' '}
                                                    {item.height}&quot;
                                                    {item.isCustomDimension && ' · Custom size'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        );
                    })}

                    {orders.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                            <Pagination
                                count={orders.totalPages}
                                page={page}
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root.Mui-selected': {
                                        bgcolor: BRAND_BLUE,
                                        color: '#ffffff',
                                        '&:hover': { bgcolor: '#124578' },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Stack>
            ) : (
                <Box
                    sx={{
                        py: 8,
                        textAlign: 'center',
                        color: 'text.secondary',
                    }}
                >
                    <ReceiptLongOutlinedIcon
                        sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.25), mb: 1.5 }}
                    />
                    <Typography sx={{ fontWeight: 600, color: theme.palette.grey[700], mb: 0.5 }}>
                        No orders yet
                    </Typography>
                    <Typography variant="body2">
                        When you place an order, it will show up here.
                    </Typography>
                </Box>
            )}
        </Stack>
    );
}
