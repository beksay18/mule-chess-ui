import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

import { ShippingAddressResponse } from '../../../api/orderDetails';

const cardSx = {
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'grey.200',
    boxShadow: 'none',
};

function InfoRow({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <Box sx={{ py: 0.85 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
        </Box>
    );
}

export function ShippingInfo({ shippingAddress }: { shippingAddress: ShippingAddressResponse | null }) {
    return (
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, md: 2.5 } }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <LocalShippingOutlinedIcon fontSize="small" color="action" />
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Shipping address</Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {shippingAddress ? (
                <>
                    <InfoRow label="Address" value={shippingAddress.addressLine1} />
                    <InfoRow label="Address line 2" value={shippingAddress.addressLine2} />
                    <InfoRow label="City" value={shippingAddress.city} />
                    <InfoRow label="State" value={shippingAddress.state} />
                    <InfoRow label="Postal code" value={shippingAddress.postalCode} />
                    <InfoRow label="Country" value={shippingAddress.country} />
                </>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    No shipping address on this order.
                </Typography>
            )}
        </Paper>
    );
}
