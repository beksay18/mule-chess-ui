import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../../../utils/table-no-data';
import { OrderTableHead } from '../order-table-head';
import { OrderTableRow } from '../order-table-row';
import { getAllOrders, getOrderStatusCount, OrderContent } from 'src/api/order';
import { useRouter } from '../../../routes/hooks';
import {OrderTableToolbar} from "../order-table-toolbar";
import {FiltersProps} from "../order-filters";
import {useLocation} from "react-router";

const STATUS_TABS = [
    { value: 'ALL', label: 'All' },
    { value: 'NEW', label: 'New' },
    { value: 'IN_PROGRESS', label: 'In progress' },
    { value: 'READY_TO_SHIP', label: 'Ready to ship' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'CANCELLED', label: 'Cancelled' },
] as const;

type StatusTab = (typeof STATUS_TABS)[number]['value'];

export function OrderView() {
    const [searchParams] = useSearchParams();
    const router = useRouter();
    const location = useLocation();

    const initialPage = parseInt(searchParams.get('page') || '0', 10);
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orders, setOrders] = useState<OrderContent[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [filters, setFilters] = useState('');
    const [filterState, setFilterState] = useState<FiltersProps>({ orderStatus: [] });
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [orderNumber, setOrderNumber] = useState('');
    const [customer, setCustomer] = useState('');
    const [userId, setUserId] = useState('');
    const [filterVersion, setFilterVersion] = useState(0);
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchOrders = async () => {
            if (filters === '' && location.search.includes('filter=')) {
                return;
            }
            setLoading(true);
            try {
                const response = await getAllOrders({
                    page,
                    size: rowsPerPage,
                    filter: filters,
                });

                const total = response.totalElements;
                setTotalOrders(total);

                const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1);
                if (page > maxPage) {
                    setPage(maxPage);
                    router.push(`/orders?page=${maxPage}`);
                    return;
                }

                setOrders(response.content);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page, rowsPerPage, filters, filterVersion]);

    useEffect(() => {
        const selectedUserId = filters.match(/userId:([^,]*)/)?.[1];
        getOrderStatusCount(selectedUserId)
            .then((counts) => {
                const next: Record<string, number> = {};
                counts.forEach((item) => {
                    next[item.status] = item.count;
                });
                setStatusCounts(next);
            })
            .catch(() => setStatusCounts({}));
    }, [filters]);

    const handleChangePage = (event: unknown, newPage: number) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage.toString());
        router.push(`/orders?${params.toString()}`);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        const params = new URLSearchParams(location.search);
        params.set('page', '0');
        router.push(`/orders?${params.toString()}`);
        setRowsPerPage(newSize);
        setPage(0);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filterQuery = params.get('filter') || '';
        setFilters(filterQuery);

        const statusMatch = filterQuery.match(/orderStatus:([^,]*)/);
        const numberMatch = filterQuery.match(/orderNumber:([^,]*)/);
        const customerMatch = filterQuery.match(/customer:([^,]*)/);
        const userIdMatch = filterQuery.match(/userId:([^,]*)/);

        const orderStatus = statusMatch ? statusMatch[1].split('|') : [];
        const extractedOrderNumber = numberMatch ? numberMatch[1] : '';
        const extractedCustomer = customerMatch ? customerMatch[1] : '';
        const extractedUserId = userIdMatch ? userIdMatch[1] : '';

        setFilterState({ orderStatus });
        setOrderNumber(extractedOrderNumber);
        setUserId(extractedUserId);
        setCustomer(extractedUserId ? params.get('userName') || '' : extractedCustomer);

        setFilterVersion((prev) => prev + 1);
    }, [location.search]);

    const applyCombinedFilters = (
        orderNum: string,
        customerName: string,
        statuses: string[],
        selectedUserId: string = userId
    ) => {
        let filterString = '';
        if (statuses.length > 0) {
            filterString += `orderStatus:${statuses.join('|')}`;
        }
        if (orderNum) {
            filterString += `${filterString ? ',' : ''}orderNumber:${orderNum}`;
        }
        if (selectedUserId) {
            filterString += `${filterString ? ',' : ''}userId:${selectedUserId}`;
        } else if (customerName.trim()) {
            filterString += `${filterString ? ',' : ''}customer:${customerName.trim()}`;
        }
        const params = new URLSearchParams(location.search);
        params.set('page', '0');
        if (filterString) {
            params.set('filter', filterString);
        } else {
            params.delete('filter');
        }
        if (selectedUserId && customerName.trim()) {
            params.set('userName', customerName.trim());
        } else {
            params.delete('userName');
        }

        router.push(`/orders?${params.toString()}`);

        setFilters(filterString);
        setUserId(selectedUserId);
        setPage(0);
        setFilterVersion((prev) => prev + 1);
    };

    const activeStatus: StatusTab =
        filterState.orderStatus?.length === 1 &&
        STATUS_TABS.some((tab) => tab.value === filterState.orderStatus?.[0])
            ? (filterState.orderStatus[0] as StatusTab)
            : 'ALL';

    const handleStatusTab = (_event: React.SyntheticEvent, value: StatusTab) => {
        const statuses = value === 'ALL' ? [] : [value];
        setFilterState({ orderStatus: statuses });
        applyCombinedFilters(orderNumber, customer, statuses);
    };

    const allCount = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

    const from = page * rowsPerPage + 1;
    const to = Math.min((page + 1) * rowsPerPage, totalOrders);

    const notFound = Array.isArray(orders) && orders.length === 0 && !!filters;

    return (
        <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
            <Card>
                <Tabs
                    value={activeStatus}
                    onChange={handleStatusTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                    {STATUS_TABS.map((tab) => {
                        const hasCounts = Object.keys(statusCounts).length > 0;
                        const count = tab.value === 'ALL' ? allCount : (statusCounts[tab.value] ?? 0);
                        return (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={hasCounts ? `${tab.label} (${count})` : tab.label}
                            />
                        );
                    })}
                </Tabs>

                <OrderTableToolbar
                    orderNumber={orderNumber}
                    customer={customer}
                    onFilterOrderNumber={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value = event.target.value;
                        setOrderNumber(value);
                        applyCombinedFilters(value, customer, filterState.orderStatus ?? []);
                    }}
                    onFilterCustomer={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value = event.target.value;
                        setCustomer(value);
                        setUserId('');
                        applyCombinedFilters(orderNumber, value, filterState.orderStatus ?? [], '');
                    }}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        {loading ? (
                            <Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Table sx={{ minWidth: 800 }}>
                                <OrderTableHead
                                    headLabel={[
                                        { id: 'orderNumber', label: 'Order #' },
                                        { id: 'customerInfo', label: 'Customer' },
                                        { id: 'location', label: 'Location' },
                                        { id: 'totalAmount', label: 'Total' },
                                        { id: 'orderStatus', label: 'Status' },
                                        { id: 'dateCreated', label: 'Date' },
                                        { id: 'paymentStatus', label: 'Payment Status' },
                                    ]}
                                />
                                <TableBody>
                                    {orders.map((row) => (
                                        <OrderTableRow
                                            key={row.orderId}
                                            row={row}
                                            selected={selected.includes(row.orderId.toString())}
                                            onSelectRow={() =>
                                                setSelected((prev) =>
                                                    prev.includes(row.orderId.toString())
                                                        ? prev.filter((id) => id !== row.orderId.toString())
                                                        : [...prev, row.orderId.toString()]
                                                )
                                            }
                                            currentPage={page}
                                        />
                                    ))}
                                    {notFound && (
                                        <TableNoData
                                            searchQuery={userId ? customer || 'this customer' : filters}
                                        />
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={page}
                    count={totalOrders}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 40]}
                    labelDisplayedRows={() => `${from}-${to} of ${totalOrders}`}
                />
            </Card>
        </DashboardContent>
    );
}
