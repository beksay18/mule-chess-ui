import * as React from 'react';
import {
    Box,
    Container,
    Typography,
    Rating,
    Paper, Card, CardContent,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {getProductById, Product} from '../../../../api/product';
import {useParams} from 'react-router-dom';
import {useRouter} from '../../../../routes/hooks';
import {useCart} from '../cart/cart-context';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import {DimensionSelector} from './dimension-selector';
import {QuantitySelector} from './quantity-selector';
import {LaminationSelector} from './lamination-selector';
import {LoadingButton} from '@mui/lab';

export default function CustomProductDetails() {
    const router = useRouter();
    const {productId} = useParams();
    const [customProduct, setCustomProduct] = useState<Product | null>(null);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const baseImageUrl = import.meta.env.VITE_API_BASE_IMAGE_URL;

    const [dimension, setDimension] = useState<{
        label: string;
        width: number;
        height: number;
        isCustom: boolean;
        error: boolean;
    }>({label: '', width: 0, height: 0, isCustom: false, error: false});

    const [quantity, setQuantity] = useState<{
        label: string;
        value: number;
        isCustom: boolean;
        error: boolean;
    }>({label: '', value: 0, isCustom: false, error: false});

    const [lamination, setLamination] = useState<string>('');
    const [laminationError, setLaminationError] = useState(false);

    const {addItem} = useCart();

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
            {quantity: 0, percentage: 0}
        );
    };

    const handleNextClick = () => {
        setSubmitAttempted(true);

        const dimValid =
            dimension.width > 0 &&
            dimension.height > 0 &&
            dimension.width <= (customProduct?.maxWidth || Infinity) &&
            dimension.height <= (customProduct?.maxHeight || Infinity);

        const qtyValid =
            quantity.value > 0 &&
            quantity.value <= (customProduct?.maxQuantity || Infinity);

        const laminationValid = lamination !== '';

        setDimension((prev) => ({...prev, error: !dimValid}));
        setQuantity((prev) => ({...prev, error: !qtyValid}));
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
                backgroundSize: 'contain',
                backgroundPosition: 'top 250px left 25%',
                backgroundRepeat: 'no-repeat',
                borderRadius: 2,
            }}
        >
            <Container
                sx={{py: {xs: 4, sm: 8}}}>
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 4}}>
                    <Box flex={5}>
                        <Typography variant="h4">{customProduct?.name}</Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Rating value={3.5} precision={0.5} readOnly/>
                            <Typography variant="body2" sx={{ml: 1}}>
                                (5,450 reviews)
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{mt: 2, color: 'text.secondary'}}>
                            {customProduct?.description}
                        </Typography>
                    </Box>

                    <Box flex={3} display="flex" flexDirection="column" gap={2} sx={{
                        fontSize: '14px',
                        '& .MuiTypography-root': { fontSize: '14px' },
                        '& .MuiFormLabel-root': { fontSize: '14px' },
                        '& .MuiInputBase-input': { fontSize: '14px' },
                        '& .MuiButton-root': { fontSize: '14px' },
                    }}>
                        <Card elevation={2} sx={{borderRadius: 2}}>
                            <CardContent>
                                <DimensionSelector
                                    dimensions={customProduct?.dimensions || []}
                                    selected={dimension}
                                    setSelected={setDimension}
                                    showError={submitAttempted}
                                    maxWidth={customProduct?.maxWidth ?? Infinity}
                                    maxHeight={customProduct?.maxHeight ?? Infinity}
                                />

                                <QuantitySelector
                                    price={customProduct?.price || 0}
                                    discounts={customProduct?.discounts || []}
                                    selected={quantity}
                                    setSelected={setQuantity}
                                    showError={submitAttempted}
                                    maxQuantity={customProduct?.maxQuantity || Infinity}
                                />

                                <LaminationSelector
                                    selected={lamination}
                                    setSelected={setLamination}
                                    showError={submitAttempted}
                                />

                                <LoadingButton
                                    variant="contained"
                                    onClick={handleNextClick}
                                    endIcon={<KeyboardTabIcon/>}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        backgroundColor: '#08A24B',
                                        color: '#ffffff',
                                        '&:hover': {
                                            backgroundColor: '#06853D',
                                        },
                                        textTransform: 'none',
                                    }}
                                    fullWidth
                                >
                                    Next: Upload Artwork
                                </LoadingButton>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
