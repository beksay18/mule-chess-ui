import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {useEffect, useState} from "react";

// ----------------------------------------------------------------------

export type FiltersProps = {
    orderStatus: string[];
};

type ProductFiltersProps = {
    canReset: boolean;
    openFilter: boolean;
    filters: FiltersProps;
    onOpenFilter: () => void;
    onCloseFilter: () => void;
    onResetFilter: () => void;
    onSetFilters: (updateState: Partial<FiltersProps>) => void;
    onApply: (filters: FiltersProps) => void;
    options: {
        orderStatus: { value: string; label: string }[];
    };
};

export function OrderFilters({
                                   filters,
                                   options,
                                   canReset,
                                   openFilter,
                                   onSetFilters,
                                   onOpenFilter,
                                   onCloseFilter,
                                   onResetFilter,
                                   onApply,
                               }: ProductFiltersProps) {

    const [tempFilters, setTempFilters] = useState<FiltersProps>(filters);

    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);

    const handleStatusToggle = (status: string) => {
        const updated = tempFilters.orderStatus.includes(status)
            ? tempFilters.orderStatus.filter((s) => s !== status)
            : [...tempFilters.orderStatus, status];
        setTempFilters((prev) => ({ ...prev, orderStatus: updated }));
    };

    const renderGender = (
        <Stack spacing={1}>
            <Typography variant="subtitle2">Status</Typography>
            <FormGroup>
                {options.orderStatus.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={tempFilters.orderStatus.includes(option.value)}
                                onChange={() => handleStatusToggle(option.value)}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>
        </Stack>
    );

    return (
        <>
            <Button
                disableRipple
                color="inherit"
                endIcon={
                    <Badge color="error" variant="dot" invisible={!canReset}>
                        <Iconify icon="ic:round-filter-list" />
                    </Badge>
                }
                onClick={onOpenFilter}
            >
                Filters
            </Button>

            <Drawer
                anchor="right"
                open={openFilter}
                onClose={onCloseFilter}
                slotProps={{
                    paper: {
                        sx: { width: 360, overflow: 'hidden' },
                    },
                }}
            >
                <Box
                    sx={{
                        py: 2,
                        pl: 2.5,
                        pr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                       Advanced Filters
                    </Typography>

                    <IconButton onClick={onResetFilter}>
                        <Badge color="error" variant="dot" invisible={!canReset}>
                            <Iconify icon="solar:restart-bold" />
                        </Badge>
                    </IconButton>

                    <IconButton onClick={onCloseFilter}>
                        <Iconify icon="mingcute:close-line" />
                    </IconButton>
                </Box>

                <Divider />

                <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        {renderGender}
                    </Stack>
                </Scrollbar>

                <Box
                    sx={{
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ height: 50 }}
                        onClick={() => {
                            onSetFilters(tempFilters);
                            onApply(tempFilters);
                            onCloseFilter();
                        }}
                    >
                        Apply Filters
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}