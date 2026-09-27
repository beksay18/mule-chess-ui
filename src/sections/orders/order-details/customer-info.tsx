import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import { CustomerOrderResponse } from '../../../api/orderDetails';
import { formatUsPhoneNumber, stripPhoneDigits } from '../../../utils/validator';

const cardSx = {
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'grey.200',
    boxShadow: 'none',
};

const formatPhone = (value?: string) => {
    if (!value) return '—';
    const digits = stripPhoneDigits(value);
    const local = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
    if (local.length === 10) return formatUsPhoneNumber(local);
    return value;
};

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Box sx={{ py: 0.85 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{value || '—'}</Typography>
        </Box>
    );
}

export function CustomerInfo({ order }: { order: CustomerOrderResponse }) {
    const contactName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim();

    return (
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, md: 2.5 } }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <PersonOutlineIcon fontSize="small" color="action" />
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Customer</Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <InfoRow label="Name" value={contactName} />
            <InfoRow label="Email" value={order.customerEmail} />
            <InfoRow label="Phone" value={formatPhone(order.customerPhone)} />
        </Paper>
    );
}
