import {useState, useCallback} from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {Label} from 'src/components/label';
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

export function OrderTableRow({row, selected, onSelectRow, currentPage}: OrderTableRowProps) {
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
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleRowClick} sx={{
                cursor: 'pointer',
                backgroundColor: row.orderStatus?.toLowerCase() === 'new' ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
            }}>
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
                                    : row.orderStatus.toLowerCase() === 'in_progress'
                                        ? 'secondary'
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
            </TableRow>
        </>
    );
}
