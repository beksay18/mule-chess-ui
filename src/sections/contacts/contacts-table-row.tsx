import { useState, useCallback } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {useRouter} from "../../routes/hooks";

// ----------------------------------------------------------------------
export type ContactsProps = {
    id: number;
    name: string,
    email: string,
    orderNumber: string,
    message: string,
    fileUrl: string,
    dateCreated: string,
};

type ContactsTableRowProps = {
    row: ContactsProps;
    selected: boolean;
    onSelectRow: () => void;
    currentPage: number;
};

export function ContactsTableRow({ row, selected, onSelectRow, currentPage }: ContactsTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const router = useRouter();

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected} sx={{ cursor: 'pointer' }}>
                <TableCell>{row.name}</TableCell>

                <TableCell>{row.email}</TableCell>

                <TableCell>{row.orderNumber}</TableCell>

                <TableCell>{row.message}</TableCell>

                <TableCell>{new Date(row.dateCreated).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })}</TableCell>

            </TableRow>
        </>
    );
}
