import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {useRouter} from "../../routes/hooks";

// ----------------------------------------------------------------------
export type OrderProps = {
    orderId: number;
    orderNumber: string;
    totalAmount: number;
    dateCreated: string;
    orderStatus: string;
    customerFirstName: string;
    customerLastName: string;
    paymentStatus: string;
    city: string;
    state: string;
};

type OrderTableRowProps = {
    row: OrderProps;
    selected: boolean;
    onSelectRow: () => void;
    currentPage: number;
};

export function OrderTableRow({ row, selected, onSelectRow, currentPage }: OrderTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const router = useRouter();

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleRowClick = () => {
        router.push(`/order-details/${row.orderId}?page=${currentPage}`);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleRowClick} sx={{ cursor: 'pointer' }}>
                <TableCell>{row.orderNumber}</TableCell>

                <TableCell>{row.customerFirstName} {row.customerLastName}</TableCell>

                <TableCell>{row.city}, {row.state}</TableCell>

                <TableCell>${row.totalAmount.toFixed(2)}</TableCell>

                <TableCell>
                    <Label
                        color={
                            row.orderStatus.toLowerCase() === 'cancelled'
                                ? 'error'
                                : row.orderStatus.toLowerCase() === 'ready_to_ship'
                                    ? 'warning'
                                    : row.orderStatus.toLowerCase() === 'new'
                                        ? 'primary'
                                        : 'success'
                        }
                    >
                        {row.orderStatus}
                    </Label>
                </TableCell>


                <TableCell>{new Date(row.dateCreated).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })}</TableCell>

                <TableCell>
                    <Label
                        color={
                            row.paymentStatus.toLowerCase() === 'paid'
                                        ? 'success'
                                        : 'warning'
                        }
                    >
                        {row.paymentStatus}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem onClick={handleClosePopover}>
                        <Iconify icon="solar:pen-bold" />
                        View
                    </MenuItem>

                    <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
