import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';

import { PaymentDTO } from '../../../api/orderDetails';

const cardSx = {
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'grey.200',
    boxShadow: 'none',
};

const money = (value: number | string | null | undefined) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return '—';
    return `$${amount.toFixed(2)}`;
};

const formatWhen = (value?: string) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.85 }}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>
                {value}
            </Typography>
        </Box>
    );
}

export function OrderSummary({ payment, totalAmount }: { payment: PaymentDTO | null; totalAmount: number }) {
    const paid = payment?.paymentStatus?.toLowerCase() === 'paid';

    return (
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, md: 2.5 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <PaymentsOutlinedIcon fontSize="small" color="action" />
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Payment</Typography>
                </Stack>
                <Chip
                    size="small"
                    label={payment?.paymentStatus ? payment.paymentStatus.toUpperCase() : 'UNPAID'}
                    color={paid ? 'success' : 'warning'}
                    sx={{ fontWeight: 700 }}
                />
            </Stack>
            <Divider />
            <InfoRow label="Order total" value={money(totalAmount)} />
            <InfoRow label="Amount paid" value={payment ? money(payment.amount) : '—'} />
            <InfoRow label="Paid on" value={formatWhen(payment?.createdAt)} />
        </Paper>
    );
}
