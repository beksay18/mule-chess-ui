import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
} from '@mui/material';
import React from 'react';

interface Discount {
    quantity: number;
    percentage: number;
}

interface QuantitySelectorProps {
    price: number;
    discounts: Discount[];
    selected: {
        label: string;
        value: number;
        isCustom: boolean;
        error: boolean;
    };
    setSelected: (val: {
        label: string;
        value: number;
        isCustom: boolean;
        error: boolean;
    }) => void;
    showError: boolean;
}

export function QuantitySelector({
                                     price,
                                     discounts,
                                     selected,
                                     setSelected,
                                     showError,
                                 }: QuantitySelectorProps) {
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value === 'customQuantity') {
            setSelected({
                label: 'customQuantity',
                value: 0,
                isCustom: true,
                error: false,
            });
        } else {
            const [qty] = value.split('|').map((v) => parseInt(v, 10));
            setSelected({
                label: value,
                value: qty,
                isCustom: false,
                error: false,
            });
        }
    };

    const handleCustomQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const qty = parseInt(event.target.value, 10);
        const isValid = !isNaN(qty) && qty > 0;
        setSelected({
            label: 'customQuantity',
            value: qty,
            isCustom: true,
            error: !isValid,
        });
    };

    return (
        <Box>
            <Typography variant="h6">Select a quantity</Typography>
            {showError && selected.value === 0 && (
                <Typography color="error" variant="body2">This field is required</Typography>
            )}
            <RadioGroup value={selected.label} onChange={handleRadioChange}>
                {discounts
                    .sort((a, b) => a.quantity - b.quantity)
                    .map((dis, index) => {
                        const discountedTotal = dis.quantity * price * (1 - dis.percentage / 100);
                        const labelText = `${dis.quantity} × $${price.toFixed(2)} = $${discountedTotal.toFixed(2)} — Save ${dis.percentage}%`;
                        const radioValue = `${dis.quantity}|${dis.percentage}`; // internal value

                        return (
                            <FormControlLabel
                                key={index}
                                value={radioValue}
                                control={<Radio />}
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            pr: 2,
                                        }}
                                    >
                                        <Typography sx={{ minWidth: 60 }}>{dis.quantity}</Typography>
                                        <Typography sx={{ minWidth: 130, textAlign: 'right' }}>
                                            ${discountedTotal.toFixed(2)}
                                        </Typography>
                                        {dis.percentage > 0 && (
                                            <Typography
                                                sx={{
                                                    color: 'green',
                                                    fontWeight: 500,
                                                    minWidth: 120,
                                                    textAlign: 'right',
                                                }}
                                            >
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
                    control={<Radio />}
                    label="Custom Quantity"
                />
                {selected.isCustom && (
                    <Box sx={{ pl: 4, mt: 1 }}>
                        <TextField
                            label="Quantity"
                            type="number"
                            size="small"
                            value={selected.value || ''}
                            onChange={handleCustomQuantityChange}
                            error={selected.error}
                            helperText={selected.error ? 'Quantity must be greater than zero' : ''}
                            inputProps={{ min: 1 }}
                            sx={{ width: 150 }}
                        />
                    </Box>
                )}
            </RadioGroup>
        </Box>
    );
}
