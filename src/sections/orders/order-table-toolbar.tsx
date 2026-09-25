import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

type OrderTableToolbarProps = {
    onFilterOrderNumber: (event: React.ChangeEvent<HTMLInputElement>) => void;
    orderNumber: string;
};

export function OrderTableToolbar({ orderNumber, onFilterOrderNumber }: OrderTableToolbarProps) {
    return (
        <Toolbar
            sx={{
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
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
                sx={{
                    width: { xs: '100%', sm: 320 },
                    height: 40,
                    fontSize: 14,
                    '& .MuiOutlinedInput-input': {
                        py: 1.2,
                    },
                }}
            />
        </Toolbar>
    );
}
