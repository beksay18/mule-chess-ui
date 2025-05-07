import {useState, useEffect, useCallback, useRef} from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { OrderTableHead } from '../order-table-head';
import { OrderTableRow } from '../order-table-row';
import { emptyRows, getComparator } from '../utils';
import {getAllOrders, OrderContent} from 'src/api/order';

// ----------------------------------------------------------------------

export function OrderView() {
  const table = useTable();
    const didFetch = useRef(false);

  const [orders, setOrders] = useState<OrderContent[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
      if (didFetch.current) return;
      console.log("Fetching orders", {
          page: table.page,
          size: table.rowsPerPage,
          filter: filterName,
      });

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
    didFetch.current = true;
  }, [table.page, table.rowsPerPage, filterName]);

  const notFound = !orders.length && !!filterName;

  return (
      <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <OrderTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    onSort={table.onSort}
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

                    <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, orders.length)}
                    />

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

// ----------------------------------------------------------------------

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('orderNumber');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
      (id: string) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      },
      [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
      (inputValue: string) => {
        const newSelected = selected.includes(inputValue)
            ? selected.filter((value) => value !== inputValue)
            : [...selected, inputValue];

        setSelected(newSelected);
      },
      [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        onResetPage();
      },
      [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
      setPage,
      setRowsPerPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
