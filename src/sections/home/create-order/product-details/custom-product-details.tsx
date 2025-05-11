import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import {getProductById, Product} from "../../../../api/product";
import {useParams} from "react-router-dom";
import {FormControlLabel, Paper, RadioGroup, Rating} from "@mui/material";
import Radio from '@mui/material/Radio';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import {useRouter} from "../../../../routes/hooks";
import {useCart} from "../cart/cart-context";

export default function CustomProductDetails() {
    const router = useRouter();
    const {productId} = useParams();
    const [customProduct, setCustomProduct] = useState<Product | null>(null);
    const [selectedDimension, setSelectedDimension] = useState('');
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');
    const [selectedQuantity, setSelectedQuantity] = useState('');
    const [customQuantity, setCustomQuantity] = useState('');
    const [selectedLamination, setSelectedLamination] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        if (productId) {
            getProductById(Number(productId)).then(setCustomProduct);
        }
    }, [productId]);

    const getBestDiscount = (qty: number) => {
        const tiers = customProduct?.discounts || [];
        return tiers.reduce((acc, tier) =>
                qty >= tier.quantity && tier.percentage > acc.percentage ? tier : acc,
            { quantity: 0, percentage: 0 }
        );
    };

    const handleUploadArtworkClick = (id: number) => {
        setSubmitAttempted(true);

        const dimensionValid = selectedDimension !== '';
        const quantityValid = selectedQuantity !== '';
        const laminationValid = selectedLamination !== '';

        if (dimensionValid && quantityValid && laminationValid) {
            const isCustomSize = selectedDimension === 'custom';
            const [width, height] = isCustomSize
                ? [parseFloat(customWidth), parseFloat(customHeight)]
                : selectedDimension.split('×').map((val) => parseFloat(val.trim().replace('″', '')));

            const isCustomQty = selectedQuantity === 'customQuantity';
            const quantity = isCustomQty ? parseInt(customQuantity) : parseInt(selectedQuantity);

            const bestDiscount = getBestDiscount(quantity);

            addItem({
                productId: customProduct?.id || 0,
                name: customProduct?.name || '',
                price: customProduct?.price || 0,
                width,
                height,
                quantity,
                percentage: bestDiscount.percentage,
                customDimension: isCustomSize,
                lamination: selectedLamination,
                discountTiers: customProduct?.discounts || []
            });

            router.push(`/product-upload/${id}`);
        }
    };

    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
            })}
        >
            <Container id="features" sx={{py: {xs: 4, sm: 8}}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'},
                        justifyContent: 'space-between',
                        gap: 4,
                    }}
                >
                    <Box sx={{flex: 1}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Typography
                                component="h2"
                                variant="h4"
                                sx={{color: 'text.primary'}}
                            >
                                {customProduct?.name}
                            </Typography>
                            <Rating
                                name="text-feedback"
                                value={3.5}
                                readOnly
                                precision={0.5}
                                size="medium"
                            />
                            <Typography variant="body2" sx={{ml: 1, color: 'text.secondary'}}>
                                (5,450 reviews)
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{color: 'text.primary', mt: 2}}>
                            Price per unit: <Box component="span" sx={{fontWeight: 'bold', color: 'primary.main'}}>
                            ${customProduct?.price}
                        </Box>
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{color: 'text.secondary', mt: 2}}
                        >
                            {customProduct?.description}
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1}}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Paper
                                sx={[
                                    (theme) => ({
                                        p: 2,
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        display: 'flex',
                                        '&:hover': {
                                            backgroundColor: (theme.vars || theme).palette.action.hover,
                                        },
                                        border: submitAttempted && !selectedDimension ? '1px solid red' : 'none',
                                    }),
                                ]}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <Typography variant="h6">Select a size</Typography>
                                        {submitAttempted && !selectedDimension && (
                                            <Typography color="error" variant="body2">This field is required</Typography>
                                        )}
                                    </Box>
                                    <RadioGroup
                                        name="product-dimensions"
                                        value={selectedDimension}
                                        onChange={(e) => setSelectedDimension(e.target.value)}
                                    >
                                        {[...(customProduct?.dimensions || [])]
                                            .sort((a, b) => a.width - b.width)
                                            .map((dim, index) => {
                                                const label = `${dim.width}\u2033 × ${dim.height}\u2033`;
                                                return (
                                                    <FormControlLabel
                                                        key={index}
                                                        value={label}
                                                        control={<Radio/>}
                                                        label={label}
                                                    />
                                                );
                                            })}
                                        <FormControlLabel
                                            value="custom"
                                            control={<Radio/>}
                                            label="Custom Size"
                                        />
                                        {selectedDimension === 'custom' && (
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, pl: 4}}>
                                                <input
                                                    type="number"
                                                    placeholder="Width"
                                                    value={customWidth}
                                                    onChange={(e) => setCustomWidth(e.target.value)}
                                                    style={{padding: '6px', width: '100px'}}
                                                />
                                                <Typography variant="h6" sx={{px: 1}}>×</Typography>
                                                <input
                                                    type="number"
                                                    placeholder="Height"
                                                    value={customHeight}
                                                    onChange={(e) => setCustomHeight(e.target.value)}
                                                    style={{padding: '6px', width: '100px'}}
                                                />
                                            </Box>
                                        )}
                                    </RadioGroup>
                                </Box>
                            </Paper>
                            <Paper
                                sx={[
                                    (theme) => ({
                                        p: 2,
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        display: 'flex',
                                        '&:hover': {
                                            backgroundColor: (theme.vars || theme).palette.action.hover,
                                        },
                                        border: submitAttempted && !selectedQuantity ? '1px solid red' : 'none',
                                    }),
                                ]}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <Typography variant="h6">Select a quantity</Typography>
                                        {submitAttempted && !selectedQuantity && (
                                            <Typography color="error" variant="body2">This field is required</Typography>
                                        )}
                                    </Box>
                                    <RadioGroup
                                        name="product-quantity"
                                        value={selectedQuantity}
                                        onChange={(e) => setSelectedQuantity(e.target.value)}
                                    >
                                        {[...(customProduct?.discounts || [])]
                                            .sort((a, b) => a.quantity - b.quantity)
                                            .map((dis, index) => {
                                                const unitPrice = customProduct?.price ?? 0;
                                                const discountedTotal = dis.quantity * unitPrice * (1 - dis.percentage / 100);

                                                const label = `${dis.quantity} × $${unitPrice} = $${discountedTotal.toFixed(2)} — Save ${dis.percentage}%`;

                                                return (
                                                    <FormControlLabel
                                                        key={index}
                                                        value={label}
                                                        control={<Radio/>}
                                                        label={
                                                            <Box sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                width: '100%',
                                                                pr: 2
                                                            }}>
                                                                <Typography
                                                                    sx={{minWidth: 60}}>{dis.quantity}</Typography>
                                                                <Typography sx={{minWidth: 130, textAlign: 'right'}}>
                                                                    ${discountedTotal.toFixed(0)}
                                                                </Typography>
                                                                {dis.percentage > 0 && (
                                                                    <Typography sx={{
                                                                        color: 'green',
                                                                        fontWeight: 500,
                                                                        minWidth: 120,
                                                                        textAlign: 'right'
                                                                    }}>
                                                                        Save {dis.percentage}%
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                );
                                            })}
                                        <FormControlLabel
                                            value="customQuantity"
                                            control={<Radio/>}
                                            label="Custom Quantity"
                                        />
                                        {selectedQuantity === 'customQuantity' && (
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, pl: 4}}>
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={customQuantity}
                                                    onChange={(e) => setCustomQuantity(e.target.value)}
                                                    style={{padding: '6px', width: '100px'}}
                                                />
                                            </Box>
                                        )}
                                    </RadioGroup>
                                </Box>
                            </Paper>
                            <Paper
                                sx={[
                                    (theme) => ({
                                        p: 2,
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        display: 'flex',
                                        '&:hover': {
                                            backgroundColor: (theme.vars || theme).palette.action.hover,
                                        },
                                        border: submitAttempted && !selectedLamination ? '1px solid red' : 'none',
                                    }),
                                ]}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <Typography variant="h6">Select lamination finish</Typography>
                                        {submitAttempted && !selectedLamination && (
                                            <Typography color="error" variant="body2">This field is required</Typography>
                                        )}
                                    </Box>
                                    <RadioGroup
                                        name="product-lamination"
                                        value={selectedLamination}
                                        onChange={(e) => setSelectedLamination(e.target.value)}
                                    >
                                        <FormControlLabel
                                            value="gloss"
                                            control={<Radio/>}
                                            label="Gloss"
                                        />
                                        <FormControlLabel
                                            value="matte"
                                            control={<Radio/>}
                                            label="Matte"
                                        />
                                    </RadioGroup>
                                </Box>
                            </Paper>
                            {customProduct?.id && (
                            <Box
                                onClick={() => handleUploadArtworkClick(customProduct.id)}
                                sx={(theme) => ({
                                    p: 2,
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex',
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                })}
                            >
                                <Typography sx={{fontWeight: 'bold', mr: 1}}>
                                    Next: upload artwork
                                </Typography>
                                <KeyboardTabIcon/>
                            </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
