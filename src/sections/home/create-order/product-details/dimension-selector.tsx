import {
    Box,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import React from 'react';

interface Dimension {
    width: number;
    height: number;
}

interface DimensionSelectorProps {
    dimensions: { width: number; height: number }[];
    selected: {
        label: string;
        width: number;
        height: number;
        isCustom: boolean;
        error: boolean;
    };
    setSelected: React.Dispatch<React.SetStateAction<{
        label: string;
        width: number;
        height: number;
        isCustom: boolean;
        error: boolean;
    }>>;
    showError: boolean;
}


export function DimensionSelector({
                                      dimensions,
                                      selected,
                                      setSelected,
                                      showError,
                                  }: DimensionSelectorProps) {
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value === 'custom') {
            setSelected({
                label: 'custom',
                width: 0,
                height: 0,
                isCustom: true,
                error: false,
            });
        } else {
            const [w, h] = value.split('x').map(Number);
            setSelected({
                label: value,
                width: w,
                height: h,
                isCustom: false,
                error: false,
            });
        }
    };

    const handleCustomChange = (
        field: 'width' | 'height',
        val: string
    ) => {
        const parsed = parseFloat(val);
        const isValid = !isNaN(parsed) && parsed > 0;

        setSelected((prev) => ({
            ...prev,
            [field]: parsed,
            error: field === 'width' ? !isValid || prev.height <= 0 : !isValid || prev.width <= 0,
        }));
    };

    return (
        <Box>
            <Typography variant="h6">Select a size</Typography>
            {showError && !selected.label && (
                <Typography color="error" variant="body2">
                    This field is required
                </Typography>
            )}

            <RadioGroup
                value={selected.label}
                onChange={handleRadioChange}
            >
                {dimensions
                    .sort((a, b) => a.width - b.width)
                    .map((dim, idx) => {
                        const label = `${dim.width}x${dim.height}`;
                        const displayLabel = `${dim.width}″ × ${dim.height}″`;
                        return (
                            <FormControlLabel
                                key={idx}
                                value={label}
                                control={<Radio />}
                                label={displayLabel}
                            />
                        );
                    })}
                <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label="Custom Size"
                />
            </RadioGroup>

            {selected.isCustom && (
                <Box sx={{ pl: 4, display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            type="number"
                            label="Width (in)"
                            value={selected.width || ''}
                            onChange={(e) => handleCustomChange('width', e.target.value)}
                            error={showError && selected.width <= 0}
                            sx={{ width: 150 }}
                            size="small"
                        />
                        <TextField
                            type="number"
                            label="Height (in)"
                            value={selected.height || ''}
                            onChange={(e) => handleCustomChange('height', e.target.value)}
                            error={showError && selected.height <= 0}
                            sx={{ width: 150 }}
                            size="small"
                        />
                    </Box>
                    {(showError && selected.width <= 0) && (
                        <Typography variant="caption" color="error">
                            Width must be greater than 0
                        </Typography>
                    )}
                    {(showError && selected.height <= 0) && (
                        <Typography variant="caption" color="error">
                            Height must be greater than 0
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}
