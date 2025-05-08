import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
export type UserProps = {
    userId: number;
    username: string;
    dateCreated: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    active: boolean;
};

type UserTableRowProps = {
    row: UserProps;
    selected: boolean;
    onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell>{row.username}</TableCell>

                <TableCell>{row.phoneNumber}</TableCell>

                <TableCell>{row.firstName}, {row.lastName}</TableCell>

                <TableCell>{row.role}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            row.active === true
                                ? 'success'
                                : row.active === false
                                    ? 'default'
                                    : 'warning'
                        }
                        sx={{
                            textTransform: 'capitalize',
                            fontSize: 12,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                        }}
                    >
                        {row.active === true ? 'Active' : row.active === false ? 'Inactive' : 'Unknown'}
                    </Label>
                </TableCell>

                <TableCell>{new Date(row.dateCreated).toLocaleDateString()}</TableCell>

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
