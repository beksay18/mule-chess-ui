import * as React from 'react';
import {
    Box,
    Container,
    Typography,
    Rating,
    Paper,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getProductById, Product } from '../../../../api/product';
import { useParams } from 'react-router-dom';
import { useRouter } from '../../../../routes/hooks';
import { useCart } from '../cart/cart-context';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { DimensionSelector } from './dimension-selector';
import { QuantitySelector } from './quantity-selector';
import { LaminationSelector } from './lamination-selector';

export default function CustomProductDetails() {
    const router = useRouter();
    const { productId } = useParams();
    const [customProduct, setCustomProduct] = useState<Product | null>(null);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const baseImageUrl = import.meta.env.VITE_API_BASE_IMAGE_URL;

    const [dimension, setDimension] = useState<{
        label: string;
        width: number;
        height: number;
        isCustom: boolean;
        error: boolean;
    }>({ label: '', width: 0, height: 0, isCustom: false, error: false });

    const [quantity, setQuantity] = useState<{
        label: string;
        value: number;
        isCustom: boolean;
        error: boolean;
    }>({ label: '', value: 0, isCustom: false, error: false });

    const [lamination, setLamination] = useState<string>('');
    const [laminationError, setLaminationError] = useState(false);

    const { addItem } = useCart();

    useEffect(() => {
        if (productId) {
            getProductById(Number(productId)).then(setCustomProduct);
        }
    }, [productId]);

    const getBestDiscount = (qty: number) => {
        const tiers = customProduct?.discounts || [];
        return tiers.reduce(
            (acc, tier) =>
                qty >= tier.quantity && tier.percentage > acc.percentage ? tier : acc,
            { quantity: 0, percentage: 0 }
        );
    };

    const handleNextClick = () => {
        setSubmitAttempted(true);

        const dimValid = dimension.width > 0 && dimension.height > 0;
        const qtyValid = quantity.value > 0;
        const laminationValid = lamination !== '';

        setDimension((prev) => ({ ...prev, error: !dimValid }));
        setQuantity((prev) => ({ ...prev, error: !qtyValid }));
        setLaminationError(!laminationValid);

        if (!dimValid || !qtyValid || !laminationValid) return;

        const discount = getBestDiscount(quantity.value);

        addItem({
            productId: customProduct?.id || 0,
            name: customProduct?.name || '',
            price: customProduct?.price || 0,
            width: dimension.width,
            height: dimension.height,
            quantity: quantity.value,
            percentage: discount.percentage,
            customDimension: dimension.isCustom,
            lamination: lamination,
            discountTiers: customProduct?.discounts || [],
            imageUrl: customProduct?.imageUrl || '',
        });

        router.push(`/product-upload/${customProduct?.id}`);
    };

    return (
        <Box
            sx={{
                backgroundImage: customProduct?.backgroundImageUrl
                    ? `url(${baseImageUrl}${customProduct.backgroundImageUrl})`
                    : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 2,
            }}
        >
            <Container
                sx={{py: { xs: 4, sm: 8 }}}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Box flex={1}>
                        <Typography variant="h4">{customProduct?.name}</Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Rating value={3.5} precision={0.5} readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                (5,450 reviews)
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Price per unit:{' '}
                            <Box component="span" fontWeight="bold" color="primary.main">
                                ${customProduct?.price}
                            </Box>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                            {customProduct?.description}
                        </Typography>
                    </Box>

                    <Box flex={1} display="flex" flexDirection="column" gap={2}>
                        <Paper sx={{ p: 2 }}>
                            <DimensionSelector
                                dimensions={customProduct?.dimensions || []}
                                selected={dimension}
                                setSelected={setDimension}
                                showError={submitAttempted}
                            />
                        </Paper>

                        <Paper sx={{ p: 2 }}>
                            <QuantitySelector
                                price={customProduct?.price || 0}
                                discounts={customProduct?.discounts || []}
                                selected={quantity}
                                setSelected={setQuantity}
                                showError={submitAttempted}
                            />
                        </Paper>

                        <Paper sx={{ p: 2 }}>
                            <LaminationSelector
                                selected={lamination}
                                setSelected={setLamination}
                                showError={submitAttempted}
                            />
                        </Paper>

                        <Box
                            onClick={handleNextClick}
                            sx={(theme) => ({
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            })}
                        >
                            <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Next: upload artwork</Typography>
                            <KeyboardTabIcon />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
