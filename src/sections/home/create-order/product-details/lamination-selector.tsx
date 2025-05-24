import React from 'react';
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';

interface LaminationSelectorProps {
    selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
    showError: boolean;
}

export function LaminationSelector({
                                       selected,
                                       setSelected,
                                       showError,
                                   }: LaminationSelectorProps) {
    return (
        <Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Typography variant="h6">Select lamination finish</Typography>
                {showError && !selected && (
                    <Typography color="error" variant="body2">
                        Lamination is required
                    </Typography>
                )}
            </Box>

            <RadioGroup
                name="lamination"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
            >
                <FormControlLabel value="gloss" control={<Radio/>} label="Gloss"/>
                <FormControlLabel value="matte" control={<Radio/>} label="Matte"/>
            </RadioGroup>
        </Box>
    );
}
