import {
    Box,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import React, {useEffect} from 'react';

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
    maxWidth: number;
    maxHeight: number;
}


export function DimensionSelector({
                                      dimensions,
                                      selected,
                                      setSelected,
                                      showError,
                                      maxWidth,
                                      maxHeight,
                                  }: DimensionSelectorProps) {

    useEffect(() => {
        setSelected((prev) => {
            const hasPredefined = dimensions.length > 0;
            const isCustom = prev.label === 'custom';

            if ((!prev.label || isCustom) && hasPredefined) {
                const first = dimensions[0];
                return {
                    label: `${first.width}x${first.height}`,
                    width: first.width,
                    height: first.height,
                    isCustom: false,
                    error: false,
                };
            }

            if (!prev.label && !hasPredefined) {
                return {
                    label: 'custom',
                    width: 0,
                    height: 0,
                    isCustom: true,
                    error: false,
                };
            }

            return prev;
        });
    }, [dimensions, setSelected]);


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
        const parsed = Number(val);
        const isInteger = Number.isInteger(parsed);
        const isValid = isInteger && parsed > 0;

        const width = field === 'width' ? parsed : selected.width;
        const height = field === 'height' ? parsed : selected.height;

        const error =
            !isValid ||
            width <= 0 ||
            height <= 0 ||
            width > maxWidth ||
            height > maxHeight;

        setSelected((prev) => ({
            ...prev,
            [field]: isNaN(parsed) ? 0 : parsed,
            error,
        }));
    };


    return (
        <Box mb={2}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography variant="h6">Select a size</Typography>
                {showError && !selected.label && (
                    <Typography color="error" variant="body2">
                        Dimensions are required
                    </Typography>
                )}
            </Box>

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
                                control={<Radio sx={{p: 0.5, ml: 1}}/>}
                                label={displayLabel}
                            />
                        );
                    })}
                <FormControlLabel
                    value="custom"
                    control={<Radio sx={{p: 0.5, ml: 1}}/>}
                    label="Custom Size"
                />
            </RadioGroup>

            {selected.isCustom && (
                <Box sx={{pl: 4, display: 'flex', gap: 1, flexDirection: 'column'}}>
                    <Box sx={{display: 'flex', gap: 2}}>
                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                            <TextField
                                type="number"
                                label="Width (in)"
                                value={selected.width > 0 ? selected.width : ''}
                                onChange={(e) => handleCustomChange('width', e.target.value)}
                                error={showError && (selected.width <= 0 || selected.width > maxWidth)}
                                sx={{width: 150}}
                                size="small"
                                required
                            />
                            {showError && (!selected.width || selected.width <= 0) && (
                                <Typography variant="caption" color="error">
                                    Width is required
                                </Typography>
                            )}
                            {showError && !Number.isInteger(selected.width) && (
                                <Typography variant="caption" color="error">
                                    Must be whole number
                                </Typography>
                            )}
                            {showError && selected.width > maxWidth && (
                                <Typography variant="caption" color="error">
                                    Max width is {maxWidth}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                            <TextField
                                type="number"
                                label="Height (in)"
                                value={selected.height || ''}
                                onChange={(e) => handleCustomChange('height', e.target.value)}
                                error={showError && (selected.height <= 0 || selected.height > maxHeight)}
                                sx={{width: 150}}
                                size="small"
                                required
                            />
                            {showError && (!selected.height || selected.height <= 0) && (
                                <Typography variant="caption" color="error">
                                    Height is required
                                </Typography>
                            )}
                            {showError && !Number.isInteger(selected.height) && (
                                <Typography variant="caption" color="error">
                                    Must be whole number
                                </Typography>
                            )}
                            {showError && selected.height > maxHeight && (
                                <Typography variant="caption" color="error">
                                    Max height is {maxHeight}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
