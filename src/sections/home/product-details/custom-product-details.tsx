import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import {getProductById, Product} from "../../../api/product";
import {useParams} from "react-router-dom";
import {FormControlLabel, Paper, RadioGroup} from "@mui/material";
import Radio from '@mui/material/Radio';

export default function CustomProductDetails() {
    const {productId} = useParams();
    const [customProduct, setCustomProduct] = useState<Product | null>(null);
    const [selectedDimension, setSelectedDimension] = useState('');
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');
    const [selectedQuantity, setSelectedQuantity] = useState('');
    const [customQuantity, setCustomQuantity] = useState('');

    useEffect(() => {
        if (productId) {
            getProductById(Number(productId)).then(setCustomProduct);
        }
    }, [productId]);

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
                        <Typography
                            component="h2"
                            variant="h4"
                            gutterBottom
                            sx={{color: 'text.primary'}}
                        >
                            {customProduct?.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{color: 'text.secondary'}}
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
                                                        control={<Radio />}
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
                                    </Box>
                                    <RadioGroup
                                        name="product-quantity"
                                        value={selectedQuantity}
                                        onChange={(e) => setSelectedQuantity(e.target.value)}
                                    >
                                        {[...(customProduct?.discounts || [])]
                                            .sort((a, b) => a.quantity - b.quantity)
                                            .map((dim, index) => {
                                                const label = `${dim.quantity} × ${dim.percentage}`;
                                                return (
                                                    <FormControlLabel
                                                        key={index}
                                                        value={label}
                                                        control={<Radio />}
                                                        label={label}
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
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
