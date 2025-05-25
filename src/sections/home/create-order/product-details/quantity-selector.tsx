import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
} from '@mui/material';
import React, {useEffect, useRef} from 'react';

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
    maxQuantity: number;
}

export function QuantitySelector({
                                     price,
                                     discounts,
                                     selected,
                                     setSelected,
                                     showError,
                                     maxQuantity
                                 }: QuantitySelectorProps) {

    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        if (discounts.length === 0) return;

        if (!selected.label) {
            const first = discounts[0];
            setSelected({
                label: `${first.quantity}|${first.percentage}`,
                value: first.quantity,
                isCustom: false,
                error: false,
            });
            initialized.current = true;
        }
    }, [discounts, selected.label, setSelected]);



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
        const isValid =
            !isNaN(qty) &&
            Number.isInteger(qty) &&
            qty > 0 &&
            qty <= maxQuantity;

        setSelected({
            label: 'customQuantity',
            value: qty,
            isCustom: true,
            error: !isValid,
        });
    };

    return (
        <Box mb={2}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography variant="h6">Select a quantity</Typography>
                    {showError && selected.value === 0 && (
                        <Typography color="error" variant="body2">Quantity is required</Typography>
                    )}
            </Box>
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
                                control={<Radio sx={{ p: 0.5, ml: 1 }}/>}
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
                    control={<Radio sx={{ p: 0.5, ml: 1 }}/>}
                    label="Custom Quantity"
                />
                {selected.isCustom && (
                    <Box sx={{ pl: 4, mt: 1, display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            label="Quantity"
                            type="number"
                            size="small"
                            value={selected.value || ''}
                            onChange={handleCustomQuantityChange}
                            error={selected.error}
                            sx={{ width: 150 }}
                        />
                        {showError && (!selected.value || selected.value <= 0) && (
                            <Typography variant="caption" color="error">
                                Quantity is required
                            </Typography>
                        )}
                        {showError && !Number.isInteger(selected.value) && (
                            <Typography variant="caption" color="error">
                                Must be whole number
                            </Typography>
                        )}
                        {showError && selected.value > maxQuantity && (
                            <Typography variant="caption" color="error">
                                Max quantity is {maxQuantity}
                            </Typography>
                        )}
                    </Box>
                )}
            </RadioGroup>
        </Box>
    );
}
