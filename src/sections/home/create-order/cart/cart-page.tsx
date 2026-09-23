import {
    Box,
    Button,
    Chip,
    Container,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from '../../../../routes/hooks';
import { useCart, type CartItem } from './cart-context';
import { calculatePrice } from '../../../sticker-builder/pricing';
import type { StickerFinish, StickerMaterial, StickerShape } from '../../../sticker-builder/types';

const BRAND_BLUE = '#175195';

function specFromCartItem(item: CartItem, quantity: number) {
    const finish: StickerFinish =
        item.finish === 'glossy' || item.lamination === 'gloss' ? 'glossy' : 'matte';
    const material = (item.material as StickerMaterial) || 'vinyl';
    const shape = (item.cutType as StickerShape) || 'die-cut';

    return {
        shape,
        size: 'custom' as const,
        customWidth: item.width,
        customHeight: item.height,
        material,
        finish,
        quantity,
    };
}

function getDiscountForQuantity(
    quantity: number,
    tiers: { quantity: number; percentage: number }[] = []
): number {
    return tiers.reduce(
        (max, tier) => (quantity >= tier.quantity && tier.percentage > max ? tier.percentage : max),
        0
    );
}

function getItemImageUrl(item: CartItem, baseImageUrl: string) {
    if (item.previewUrl) {
        return item.previewUrl;
    }
    if (item.imageUrl?.startsWith('data:')) {
        return item.imageUrl;
    }
    if (item.imageUrl) {
        return `${baseImageUrl}${item.imageUrl}`;
    }
    return undefined;
}

function formatSpecs(item: CartItem) {
    return [item.material, item.lamination || item.finish, item.cutType].filter(Boolean);
}

function getLineTotal(item: CartItem) {
    return item.price * item.quantity * (1 - item.percentage / 100);
}

function getLineSubtotal(item: CartItem) {
    return item.price * item.quantity;
}

type CartLineItemProps = {
    item: CartItem;
    index: number;
    baseImageUrl: string;
    onQuantityChange: (index: number, quantity: number) => void;
    onRemove: (index: number) => void;
    onEditDesign: (designId: string) => void;
};

function CartLineItem({
    item,
    index,
    baseImageUrl,
    onQuantityChange,
    onRemove,
    onEditDesign,
}: CartLineItemProps) {
    const theme = useTheme();
    const imageUrl = getItemImageUrl(item, baseImageUrl);
    const specs = formatSpecs(item);
    const lineTotal = getLineTotal(item);
    const lineSubtotal = getLineSubtotal(item);

    return (
        <Box
            sx={{
                px: { xs: 2, md: 2.5 },
                py: 2.5,
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'auto 1fr auto',
                    md: 'auto 1fr auto auto',
                },
                gap: { xs: 2, sm: 2.5 },
                alignItems: { sm: 'center' },
                borderBottom: `1px solid ${theme.palette.grey[100]}`,
                '&:last-of-type': { borderBottom: 0 },
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                    borderRadius: 2,
                    border: `2px dashed ${alpha(BRAND_BLUE, 0.25)}`,
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
                    <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: BRAND_BLUE }}>
                        {item.name.charAt(0)}
                    </Typography>
                )}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        color: theme.palette.grey[900],
                        mb: 0.5,
                    }}
                >
                    {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {item.width}&quot; × {item.height}&quot;
                </Typography>
                {specs.length > 0 && (
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                        {specs.map((spec) => (
                            <Chip
                                key={spec}
                                label={spec}
                                size="small"
                                sx={{
                                    height: 24,
                                    fontWeight: 600,
                                    fontSize: '0.6875rem',
                                    textTransform: 'capitalize',
                                    bgcolor: alpha(BRAND_BLUE, 0.06),
                                    color: BRAND_BLUE,
                                    border: `1px dashed ${alpha(BRAND_BLUE, 0.25)}`,
                                }}
                            />
                        ))}
                    </Stack>
                )}
                {item.designId && (
                    <Typography
                        component="button"
                        variant="body2"
                        onClick={() => onEditDesign(item.designId!)}
                        sx={{
                            border: 0,
                            p: 0,
                            bgcolor: 'transparent',
                            color: BRAND_BLUE,
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            textUnderlineOffset: 3,
                            '&:hover': { color: '#124578' },
                        }}
                    >
                        Edit design
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'center' },
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0}
                    sx={{
                        border: `1px solid ${alpha(BRAND_BLUE, 0.2)}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: '#ffffff',
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => onQuantityChange(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        sx={{
                            borderRadius: 0,
                            color: BRAND_BLUE,
                            '&:disabled': { color: 'text.disabled' },
                        }}
                    >
                        <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography
                        sx={{
                            minWidth: 40,
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            px: 0.5,
                        }}
                    >
                        {item.quantity}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => onQuantityChange(index, item.quantity + 1)}
                        aria-label="Increase quantity"
                        sx={{ borderRadius: 0, color: BRAND_BLUE }}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    {item.percentage > 0 ? (
                        <>
                            <Typography
                                variant="body2"
                                sx={{
                                    textDecoration: 'line-through',
                                    color: 'text.secondary',
                                    fontSize: '0.8125rem',
                                }}
                            >
                                ${lineSubtotal.toFixed(2)}
                            </Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: theme.palette.grey[900] }}>
                                ${lineTotal.toFixed(2)}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: '#2e7d32', fontWeight: 700 }}
                            >
                                {item.percentage}% off
                            </Typography>
                        </>
                    ) : (
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: theme.palette.grey[900] }}>
                            ${lineTotal.toFixed(2)}
                        </Typography>
                    )}
                </Box>

                <IconButton
                    onClick={() => onRemove(index)}
                    aria-label="Remove item"
                    sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main', bgcolor: alpha('#f44336', 0.08) },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default function CartPage() {
    const theme = useTheme();
    const router = useRouter();
    const { cartItems, setCartItems, removeItem } = useCart();

    const isDev = import.meta.env.MODE === 'development';
    const baseImageUrl = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';

    const handleQuantityChange = (index: number, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }

        const updated = [...cartItems];
        const item = updated[index];
        if (item.designId) {
            const breakdown = calculatePrice(specFromCartItem(item, newQuantity), {
                materials: item.materials,
            });
            updated[index] = {
                ...item,
                quantity: newQuantity,
                price: breakdown.unitPrice,
                percentage: breakdown.discountPercent,
            };
        } else {
            const newDiscount = getDiscountForQuantity(newQuantity, item.discountTiers);
            updated[index] = { ...item, quantity: newQuantity, percentage: newDiscount };
        }
        setCartItems(updated);
    };

    const subtotal = cartItems.reduce((total, item) => total + getLineSubtotal(item), 0);
    const totalDiscount = cartItems.reduce(
        (total, item) => total + getLineSubtotal(item) * (item.percentage / 100),
        0
    );
    const orderTotal = subtotal - totalDiscount;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
                <Box sx={{ textAlign: 'center' }}>
                    <ShoppingCartOutlinedIcon
                        sx={{ fontSize: 64, color: alpha(BRAND_BLUE, 0.2), mb: 2 }}
                    />
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                            letterSpacing: '-0.02em',
                            color: theme.palette.grey[900],
                            mb: 1,
                        }}
                    >
                        Your cart is empty
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 3, maxWidth: 360, mx: 'auto' }}>
                        Design a sticker in our builder or browse products to get started.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={() => router.push('/sticker-builder')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                bgcolor: BRAND_BLUE,
                                borderRadius: 50,
                                px: 3,
                                '&:hover': { bgcolor: '#124578' },
                            }}
                        >
                            Open sticker builder
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => router.push('/')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                color: BRAND_BLUE,
                                borderColor: alpha(BRAND_BLUE, 0.35),
                                borderRadius: 50,
                                px: 3,
                                '&:hover': {
                                    borderColor: BRAND_BLUE,
                                    bgcolor: alpha(BRAND_BLUE, 0.04),
                                },
                            }}
                        >
                            Browse products
                        </Button>
                    </Stack>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Stack spacing={3}>
                <Box>
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                            letterSpacing: '-0.02em',
                            color: theme.palette.grey[900],
                            mb: 0.5,
                        }}
                    >
                        Your cart
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                        {itemCount === 1 ? '1 item' : `${itemCount} items`}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
                        gap: { xs: 3, lg: 4 },
                        alignItems: 'start',
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                            bgcolor: '#ffffff',
                            boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.06)}`,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'grid' },
                                gridTemplateColumns: 'auto 1fr auto auto',
                                gap: 2.5,
                                px: 2.5,
                                py: 1.5,
                                bgcolor: alpha(BRAND_BLUE, 0.03),
                                borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                            }}
                        >
                            {['Product', 'Quantity', 'Price', ''].map((label) => (
                                <Typography
                                    key={label || 'actions'}
                                    variant="caption"
                                    sx={{
                                        fontWeight: 700,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        color: BRAND_BLUE,
                                    }}
                                >
                                    {label}
                                </Typography>
                            ))}
                        </Box>

                        {cartItems.map((item, index) => (
                            <CartLineItem
                                key={`${item.productId}-${index}`}
                                item={item}
                                index={index}
                                baseImageUrl={baseImageUrl}
                                onQuantityChange={handleQuantityChange}
                                onRemove={removeItem}
                                onEditDesign={(designId) =>
                                    router.push(`/sticker-builder?design=${designId}`)
                                }
                            />
                        ))}
                    </Box>

                    <Box
                        sx={{
                            position: { lg: 'sticky' },
                            top: { lg: 24 },
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                                bgcolor: '#ffffff',
                                boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.08)}`,
                                p: { xs: 2.5, md: 3 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '1.0625rem',
                                    color: theme.palette.grey[900],
                                    mb: 2.5,
                                }}
                            >
                                Order summary
                            </Typography>

                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ color: 'text.secondary' }}>Subtotal</Typography>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        ${subtotal.toFixed(2)}
                                    </Typography>
                                </Box>
                                {totalDiscount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: 'text.secondary' }}>Savings</Typography>
                                        <Typography sx={{ fontWeight: 700, color: '#2e7d32' }}>
                                            −${totalDiscount.toFixed(2)}
                                        </Typography>
                                    </Box>
                                )}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        pt: 2,
                                        mt: 0.5,
                                        borderTop: `1px solid ${theme.palette.grey[200]}`,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 800 }}>Order total</Typography>
                                    <Typography
                                        sx={{ fontWeight: 800, fontSize: '1.25rem', color: BRAND_BLUE }}
                                    >
                                        ${orderTotal.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                endIcon={<LockOutlinedIcon />}
                                onClick={handleCheckout}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    borderRadius: 50,
                                    bgcolor: BRAND_BLUE,
                                    boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.28)}`,
                                    '&:hover': {
                                        bgcolor: '#124578',
                                        boxShadow: `0 10px 28px ${alpha(BRAND_BLUE, 0.35)}`,
                                    },
                                }}
                            >
                                Checkout
                            </Button>

                            <Typography
                                component="button"
                                onClick={() => router.push('/')}
                                sx={{
                                    display: 'block',
                                    width: '100%',
                                    mt: 2,
                                    border: 0,
                                    p: 0,
                                    bgcolor: 'transparent',
                                    textAlign: 'center',
                                    color: 'text.secondary',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': { color: BRAND_BLUE },
                                }}
                            >
                                or continue shopping
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </Container>
    );
}
