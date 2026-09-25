import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

const searchFieldSx = {
    width: { xs: '100%', sm: 280 },
    height: 40,
    fontSize: 14,
    '& .MuiOutlinedInput-input': {
        py: 1.2,
    },
};

type OrderTableToolbarProps = {
    orderNumber: string;
    customer: string;
    onFilterOrderNumber: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFilterCustomer: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function OrderTableToolbar({
    orderNumber,
    customer,
    onFilterOrderNumber,
    onFilterCustomer,
}: OrderTableToolbarProps) {
    return (
        <Toolbar
            sx={{
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
                p: (theme) => theme.spacing(2, 3, 1, 3),
            }}
        >
            <OutlinedInput
                value={orderNumber}
                onChange={onFilterOrderNumber}
                placeholder="Search order number..."
                startAdornment={
                    <InputAdornment position="start">
                        <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                }
                sx={searchFieldSx}
            />
            <OutlinedInput
                value={customer}
                onChange={onFilterCustomer}
                placeholder="Search customer..."
                startAdornment={
                    <InputAdornment position="start">
                        <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                }
                sx={searchFieldSx}
            />
        </Toolbar>
    );
}
