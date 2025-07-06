import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';
import { FiltersProps, OrderFilters } from './order-filters';
import { useCallback, useEffect, useState } from 'react';

const STATUS_OPTIONS = [
    { value: 'NEW', label: 'New' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'READY_TO_SHIP', label: 'Ready to Ship' },
    { value: 'SHIPPED', label: 'Shipped' },
];

type OrderTableToolbarProps = {
    onFilterOrderNumber: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filters: FiltersProps;
    orderNumber: string;
    onApplyFilters: (filters: FiltersProps, orderNumber: string) => void;
};

export function OrderTableToolbar({
                                      orderNumber,
                                      onFilterOrderNumber,
                                      filters,
                                      onApplyFilters,
                                  }: OrderTableToolbarProps) {
    const [openFilter, setOpenFilter] = useState(false);
    const [tempFilters, setTempFilters] = useState<FiltersProps>(filters);

    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);

    const handleOpenFilter = useCallback(() => {
        setTempFilters(filters);
        setOpenFilter(true);
    }, [filters]);

    const handleCloseFilter = useCallback(() => {
        setOpenFilter(false);
    }, []);

    const handleSetFilters = (newFilters: FiltersProps) => {
        setTempFilters(newFilters);
        onApplyFilters(newFilters, orderNumber);
    };

    const canReset =
        JSON.stringify(tempFilters.orderStatus ?? []) !==
        JSON.stringify([]);

    const getStatusLabel = (value: string) =>
        STATUS_OPTIONS.find((opt) => opt.value === value)?.label || value;

    return (
        <Toolbar
            sx={{
                height: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap',
                p: (theme) => theme.spacing(2, 3, 1, 3),
                gap: 2,
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 320 }}>
                <OutlinedInput
                    fullWidth
                    value={orderNumber}
                    onChange={onFilterOrderNumber}
                    placeholder="Search order number..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify
                                width={20}
                                icon="eva:search-fill"
                                sx={{ color: 'text.disabled' }}
                            />
                        </InputAdornment>
                    }
                    sx={{
                        height: 40,
                        fontSize: 14,
                        '& .MuiOutlinedInput-input': {
                            py: 1.2,
                        },
                    }}
                />

                {tempFilters.orderStatus && tempFilters.orderStatus.length > 0 && (
                    <Box
                        sx={{
                            mt: 1,
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                        }}
                    >
                        {tempFilters.orderStatus.map((status) => (
                            <Box
                                key={status}
                                sx={{
                                    px: 1.2,
                                    py: 0.5,
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    fontSize: 12,
                                    borderRadius: 1,
                                }}
                            >
                                {getStatusLabel(status)}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                }}
            >
                <OrderFilters
                    canReset={canReset}
                    filters={tempFilters}
                    onSetFilters={handleSetFilters}
                    openFilter={openFilter}
                    onOpenFilter={handleOpenFilter}
                    onCloseFilter={handleCloseFilter}
                    onResetFilter={() => {
                        const resetFilters: FiltersProps = { orderStatus: [] };
                        setTempFilters(resetFilters);
                        onApplyFilters(resetFilters, orderNumber);
                    }}
                    options={{
                        orderStatus: STATUS_OPTIONS,
                    }}
                />
            </Box>
        </Toolbar>
    );
}
