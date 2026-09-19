import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import type { CartItem } from '../cart/cart-context';

const BRAND_BLUE = '#175195';

function getItemImageUrl(item: CartItem) {
    if (item.previewUrl) return item.previewUrl;
    if (item.imageUrl?.startsWith('data:')) return item.imageUrl;
    return undefined;
}

export default function OrderSummary({ items }: { items: CartItem[] }) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = items.reduce(
        (sum, item) => sum + item.price * item.quantity * (item.percentage / 100),
        0
    );
    const orderTotal = subtotal - totalDiscount;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Box
            sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                bgcolor: '#ffffff',
                boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.08)}`,
                overflow: 'hidden',
            }}
        >
            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a' }}>
                    Order summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {itemCount === 1 ? '1 item' : `${itemCount} items`}
                </Typography>
            </Box>

            <Stack divider={<Divider />} sx={{ px: 3 }}>
                {items.map((item, index) => {
                    const imageUrl = getItemImageUrl(item);
                    const lineTotal = item.price * item.quantity * (1 - item.percentage / 100);
                    const specs = [item.material, item.lamination || item.finish, item.cutType].filter(Boolean);

                    return (
                        <Stack key={`${item.productId}-${index}`} direction="row" spacing={1.5} sx={{ py: 2 }}>
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    flexShrink: 0,
                                    borderRadius: 2,
                                    border: `1.5px dashed ${alpha(BRAND_BLUE, 0.25)}`,
                                    bgcolor: alpha(BRAND_BLUE, 0.03),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                {imageUrl ? (
                                    <Box
                                        component="img"
                                        src={imageUrl}
                                        alt={item.name}
                                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <Typography sx={{ fontWeight: 800, color: BRAND_BLUE }}>
                                        {item.name.charAt(0)}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography fontWeight={700} noWrap sx={{ color: '#0f172a' }}>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.width}&quot; × {item.height}&quot; · Qty {item.quantity}
                                </Typography>
                                {specs.length > 0 && (
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                                        {specs.map((spec) => (
                                            <Chip
                                                key={spec}
                                                label={spec}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontWeight: 600,
                                                    fontSize: '0.6875rem',
                                                    textTransform: 'capitalize',
                                                    bgcolor: alpha(BRAND_BLUE, 0.06),
                                                    color: BRAND_BLUE,
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                            <Typography fontWeight={700} sx={{ color: '#0f172a' }}>
                                ${lineTotal.toFixed(2)}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>

            <Box sx={{ px: 3, pb: 3, pt: 1 }}>
                <Stack spacing={1.25}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography fontWeight={600}>${subtotal.toFixed(2)}</Typography>
                    </Box>
                    {totalDiscount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">Savings</Typography>
                            <Typography fontWeight={700} sx={{ color: '#06853D' }}>
                                −${totalDiscount.toFixed(2)}
                            </Typography>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 1.5,
                            borderTop: `1px solid ${alpha('#0f172a', 0.08)}`,
                        }}
                    >
                        <Typography fontWeight={800}>Order total</Typography>
                        <Typography fontWeight={800} sx={{ fontSize: '1.25rem', color: BRAND_BLUE }}>
                            ${orderTotal.toFixed(2)}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
