import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import {Iconify} from 'src/components/iconify';
import {FiltersProps, OrderFilters} from "./order-filters";
import {useCallback, useState} from "react";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const GENDER_OPTIONS = [
    {value: 'men', label: 'Men'},
    {value: 'women', label: 'Women'},
    {value: 'kids', label: 'Kids'},
];

const CATEGORY_OPTIONS = [
    {value: 'all', label: 'All'},
    {value: 'shose', label: 'Shose'},
    {value: 'apparel', label: 'Apparel'},
    {value: 'accessories', label: 'Accessories'},
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
    {value: 'below', label: 'Below $25'},
    {value: 'between', label: 'Between $25 - $75'},
    {value: 'above', label: 'Above $75'},
];

const COLOR_OPTIONS = [
    '#00AB55',
    '#000000',
    '#FFFFFF',
    '#FFC0CB',
    '#FF4842',
    '#1890FF',
    '#94D82D',
    '#FFC107',
];

const defaultFilters = {
    price: '',
    gender: [GENDER_OPTIONS[0].value],
    colors: [COLOR_OPTIONS[4]],
    rating: RATING_OPTIONS[0],
    category: CATEGORY_OPTIONS[0].value,
};

type OrderTableToolbarProps = {
    filterName: string;
    onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function OrderTableToolbar({filterName, onFilterName}: OrderTableToolbarProps) {
    const [openFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

    const handleOpenFilter = useCallback(() => {
        setOpenFilter(true);
    }, []);

    const handleCloseFilter = useCallback(() => {
        setOpenFilter(false);
    }, []);

    const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
        setFilters((prevValue) => ({...prevValue, ...updateState}));
    }, []);

    const canReset = Object.keys(filters).some(
        (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
    );

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
                        <Iconify width={20} icon="eva:search-fill" sx={{color: 'text.disabled'}}/>
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
                        filters={filters}
                        onSetFilters={handleSetFilters}
                        openFilter={openFilter}
                        onOpenFilter={handleOpenFilter}
                        onCloseFilter={handleCloseFilter}
                        onResetFilter={() => setFilters(defaultFilters)}
                        options={{
                            genders: GENDER_OPTIONS,
                            categories: CATEGORY_OPTIONS,
                            ratings: RATING_OPTIONS,
                            price: PRICE_OPTIONS,
                            colors: COLOR_OPTIONS,
                        }}
                    />
                </Box>
            </Box>
        </Toolbar>
    );
}