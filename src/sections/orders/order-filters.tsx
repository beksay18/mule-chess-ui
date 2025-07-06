import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';
import {useEffect, useState} from "react";
import {Select} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

// ----------------------------------------------------------------------

export type FiltersProps = {
    orderStatus?: string[];
};

type ProductFiltersProps = {
    canReset: boolean;
    openFilter: boolean;
    filters: FiltersProps;
    onOpenFilter: () => void;
    onCloseFilter: () => void;
    onResetFilter: () => void;
    onSetFilters: (updateState: FiltersProps | Partial<FiltersProps>) => void;
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
                             }: ProductFiltersProps) {

    const [tempFilters, setTempFilters] = useState<FiltersProps>(filters);

    useEffect(() => {
        setTempFilters(filters);
    }, []);

    const renderStatus = (
        <Stack spacing={1}>
            <Select
                multiple
                displayEmpty
                value={tempFilters.orderStatus ?? []}
                onChange={(event: any) => {
                    const selected = typeof event.target.value === 'string'
                        ? event.target.value.split(',')
                        : event.target.value;

                    setTempFilters((prev) => ({
                        ...prev,
                        orderStatus: selected,
                    }));
                }}
                input={<OutlinedInput />}
                renderValue={(selected: any) =>
                    selected.length === 0 ? 'Select Status' : (selected as string[]).join(', ')
                }
                sx={{ width: '100%' }}
            >
                {options.orderStatus.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <Checkbox
                            checked={(tempFilters.orderStatus ?? []).includes(option.value)}
                        />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        </Stack>
    );

    return (
        <>
            <Button
                disableRipple
                color="inherit"
                endIcon={
                    <Badge color="error" variant="dot" invisible={!canReset}>
                        <Iconify icon="ic:round-filter-list"/>
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
                        sx: {width: 360, overflow: 'hidden'},
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
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Advanced Filters
                    </Typography>

                    <IconButton
                        onClick={() => {
                            const resetFilters = {orderStatus: []};
                            setTempFilters(resetFilters);
                            onSetFilters(resetFilters);
                            onResetFilter();
                        }}>
                        <Badge color="error" variant="dot" invisible={!canReset}>
                            <Iconify icon="solar:restart-bold"/>
                        </Badge>
                    </IconButton>

                    <IconButton onClick={onCloseFilter}>
                        <Iconify icon="mingcute:close-line"/>
                    </IconButton>
                </Box>

                <Divider/>

                <Scrollbar>
                    <Stack spacing={3} sx={{p: 3}}>
                        {renderStatus}
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
                        sx={{height: 50}}
                        onClick={() => {
                            onSetFilters(tempFilters);
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