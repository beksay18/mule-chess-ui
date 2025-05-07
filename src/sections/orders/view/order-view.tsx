import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { OrderTableHead } from '../order-table-head';
import { OrderTableRow } from '../order-table-row';
import { getAllOrders, OrderContent } from 'src/api/order';
import {useTable} from "../../../utils/use-table";

// ----------------------------------------------------------------------

export function OrderView() {
    const table = useTable(0, 10);
    const [orders, setOrders] = useState<OrderContent[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders({
                    page: table.page,
                    size: table.rowsPerPage,
                    filter: filterName,
                });
                setOrders(response.content);
                setTotalOrders(response.totalElements);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, [table.page, table.rowsPerPage, filterName]);

    useEffect(() => {
        table.onResetPage(); // Reset to first page when filter changes
    }, [filterName]);

    const notFound = !orders.length && !!filterName;

    return (
        <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <OrderTableHead
                                headLabel={[
                                    { id: 'orderNumber', label: 'Order #' },
                                    { id: 'customerEmail', label: 'Email' },
                                    { id: 'customerPhone', label: 'Phone' },
                                    { id: 'totalAmount', label: 'Total' },
                                    { id: 'orderStatus', label: 'Status' },
                                    { id: 'dateCreated', label: 'Date' },
                                    { id: '', label: '' },
                                ]}
                            />
                            <TableBody>
                                {orders.map((row) => (
                                    <OrderTableRow
                                        key={row.orderId}
                                        row={row}
                                        selected={table.selected.includes(row.orderId.toString())}
                                        onSelectRow={() => table.onSelectRow(row.orderId.toString())}
                                    />
                                ))}

                                {notFound && <TableNoData searchQuery={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={table.page}
                    count={totalOrders}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 40]}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                />
            </Card>
        </DashboardContent>
    );
}
