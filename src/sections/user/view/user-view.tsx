import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../../../utils/table-no-data';
import { useTable } from "../../../utils/use-table";
import {getAllUsers, UserContent} from "../../../api/user";
import {UserTableHead} from "../user-table-head";
import {UserTableRow} from "../user-table-row";

// ----------------------------------------------------------------------

export function UserView() {
    const table = useTable(0, 10);
    const [users, setUsers] = useState<UserContent[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [filters, setFilters] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers({
                    page: table.page,
                    size: table.rowsPerPage,
                    filter: filters,
                });
                setUsers(response.content);
                setTotalUsers(response.totalElements);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, [table.page, table.rowsPerPage, filters]);

    useEffect(() => {
        table.onResetPage();
    }, [filters]);

    const notFound = Array.isArray(users) && users.length === 0 && !!filters;

    return (
        <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                headLabel={[
                                    { id: 'username', label: 'Email' },
                                    { id: 'phoneNumber', label: 'Phone Number' },
                                    { id: 'fullName', label: 'Full Name' },
                                    { id: 'role', label: 'Role' },
                                    { id: 'orderStatus', label: 'Status' },
                                    { id: 'dateCreated', label: 'Date Created' },
                                    { id: '', label: '' },
                                ]}
                            />
                            <TableBody>
                                {users.map((row) => (
                                    <UserTableRow
                                        key={row.userId}
                                        row={row}
                                        selected={table.selected.includes(row.userId.toString())}
                                        onSelectRow={() => table.onSelectRow(row.userId.toString())}
                                    />
                                ))}
                                {notFound && <TableNoData searchQuery={filters} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={table.page}
                    count={totalUsers}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={(event, newPage) => {
                        table.onChangePage(event, newPage);
                    }}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 40]}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                />
            </Card>
        </DashboardContent>
    );
}
