import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import {Iconify} from 'src/components/iconify';
import {FiltersProps, OrderFilters} from "./order-filters";
import {useCallback, useState} from "react";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
    {value: 'NEW', label: 'NEW'},
    {value: 'IN_PROGRESS', label: 'In Progress'},
    {value: 'READY_TO_SHIP', label: 'Ready to Ship'},
    {value: 'SHIPPED', label: 'Shipped'},
];

type OrderTableToolbarProps = {
    filterName: string;
    onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filters: FiltersProps;
    onApplyFilters: (filters: FiltersProps) => void;
};

export function OrderTableToolbar({
                                      filterName,
                                      onFilterName,
                                      filters,
                                      onApplyFilters,
                                  }: OrderTableToolbarProps) {
    const [openFilter, setOpenFilter] = useState(false);
    const [tempFilters, setTempFilters] = useState<FiltersProps>(filters);

    const handleOpenFilter = useCallback(() => {
        setTempFilters(filters); // keep in sync
        setOpenFilter(true);
    }, [filters]);

    const handleCloseFilter = useCallback(() => {
        setOpenFilter(false);
    }, []);

    const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
        setTempFilters((prev) => ({ ...prev, ...updateState }));
    }, []);

    const canReset = JSON.stringify(tempFilters) !== JSON.stringify({ orderStatus: [] });

    return (
        <Toolbar
            sx={{
                height: 80,
                display: 'flex',
                justifyContent: 'space-between',
                p: (theme) => theme.spacing(0, 1, 0, 3),
            }}
        >
            <OutlinedInput
                fullWidth
                value={filterName}
                onChange={onFilterName}
                placeholder="Search order number..."
                startAdornment={
                    <InputAdornment position="start">
                        <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                }
                sx={{
                    maxWidth: 320,
                    height: 40,
                    fontSize: 14,
                    '& .MuiOutlinedInput-input': {
                        py: 1.2,
                    },
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap-reverse',
                    justifyContent: 'flex-end',
                }}
            >
                <Box
                    sx={{
                        my: 1,
                        gap: 1,
                        flexShrink: 0,
                        display: 'flex',
                    }}
                >
                    <OrderFilters
                        canReset={canReset}
                        filters={tempFilters}
                        onSetFilters={handleSetFilters}
                        openFilter={openFilter}
                        onOpenFilter={handleOpenFilter}
                        onCloseFilter={handleCloseFilter}
                        onResetFilter={() => setTempFilters({ orderStatus: [] })}
                        options={{
                            orderStatus: STATUS_OPTIONS,
                        }}
                        onApply={() => {
                            onApplyFilters(tempFilters);
                            setOpenFilter(false);
                        }}
                    />
                </Box>
            </Box>
        </Toolbar>
    );
}
