import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../../../utils/table-no-data';
import { ContactsTableHead } from '../contacts-table-head';
import { ContactsTableRow } from '../contacts-table-row';
import { useRouter } from '../../../routes/hooks';
import {ContactsContent, getAllContacts} from "../../../api/contacts";

export function ContactsView() {
    const [searchParams] = useSearchParams();
    const router = useRouter();

    const initialPage = parseInt(searchParams.get('page') || '0', 10);
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [contacts, setContacts] = useState<ContactsContent[]>([]);
    const [totalContacts, setTotalContacts] = useState(0);
    const [filters, setFilters] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                const response = await getAllContacts({
                    page,
                    size: rowsPerPage,
                    filter: filters,
                });

                const total = response.totalElements;
                setTotalContacts(total);

                const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1);
                if (page > maxPage) {
                    setPage(maxPage);
                    router.push(`/contacts?page=${maxPage}`);
                    return;
                }

                setContacts(response.content);
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [page, rowsPerPage, filters]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        router.push(`/contacts?page=${newPage}`);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
        router.push(`/contacts?page=0`);
    };

    const from = page * rowsPerPage + 1;
    const to = Math.min((page + 1) * rowsPerPage, totalContacts);

    const notFound = Array.isArray(contacts) && contacts.length === 0 && !!filters;

    return (
        <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        {loading ? (
                            <Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Table sx={{ minWidth: 800 }}>
                                <ContactsTableHead
                                    headLabel={[
                                        { id: 'fullName', label: 'Full Name' },
                                        { id: 'email', label: 'Email' },
                                        { id: 'orderNumber', label: 'Order Number' },
                                        { id: 'message', label: 'Message' },
                                        { id: 'dateCreated', label: 'Date' },
                                        { id: 'contactStatus', label: 'Status' },
                                        { id: '', label: '' },
                                    ]}
                                />
                                <TableBody>
                                    {contacts.map((row) => (
                                        <ContactsTableRow
                                            key={row.id}
                                            row={row}
                                            selected={selected.includes(row.id.toString())}
                                            onSelectRow={() =>
                                                setSelected((prev) =>
                                                    prev.includes(row.id.toString())
                                                        ? prev.filter((id) => id !== row.id.toString())
                                                        : [...prev, row.id.toString()]
                                                )
                                            }
                                            currentPage={page}
                                        />
                                    ))}
                                    {notFound && <TableNoData searchQuery={filters} />}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={page}
                    count={totalContacts}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 40]}
                    labelDisplayedRows={() => `${from}-${to} of ${totalContacts}`}
                />
            </Card>
        </DashboardContent>
    );
}
