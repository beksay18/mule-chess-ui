import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { ContactsTableHead } from '../contacts-table-head';
import { ContactsTableRow } from '../contacts-table-row';
import { useRouter } from '../../../routes/hooks';
import { ContactsContent, getAllContacts, getNewContactCount } from '../../../api/contacts';

const BRAND_BLUE = '#175195';

const STATUS_FILTERS = ['All', 'Waiting', 'Replied'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function buildStatusFilter(status: StatusFilter) {
    if (status === 'Waiting') {
        return 'waiting:true';
    }
    if (status === 'Replied') {
        return 'waiting:false';
    }
    return '';
}

export function ContactsView() {
    const theme = useTheme();
    const [searchParams] = useSearchParams();
    const router = useRouter();

    const initialPage = parseInt(searchParams.get('page') || '0', 10);
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [contacts, setContacts] = useState<ContactsContent[]>([]);
    const [totalContacts, setTotalContacts] = useState(0);
    const [filters, setFilters] = useState('');
    const [activeStatus, setActiveStatus] = useState<StatusFilter>('All');
    const [loading, setLoading] = useState(false);
    const [newCount, setNewCount] = useState(0);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const [response, pendingCount] = await Promise.all([
                getAllContacts({ page, size: rowsPerPage, filter: filters }),
                getNewContactCount().catch(() => 0),
            ]);

            const total = response.totalElements;
            setTotalContacts(total);
            setNewCount(pendingCount);

            const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1);
            if (page > maxPage) {
                setPage(maxPage);
                router.push(`/contacts?page=${maxPage}`);
                return;
            }

            setContacts(response.content);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, filters, router]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleStatusChange = (status: StatusFilter) => {
        setActiveStatus(status);
        setFilters(buildStatusFilter(status));
        setPage(0);
        router.push('/contacts?page=0');
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
        router.push(`/contacts?page=${newPage}`);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
        router.push('/contacts?page=0');
    };

    const from = totalContacts === 0 ? 0 : page * rowsPerPage + 1;
    const to = Math.min((page + 1) * rowsPerPage, totalContacts);
    const notFound = contacts.length === 0 && !loading;

    return (
        <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
            <Stack spacing={3}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', maxWidth: 560 }}>
                    Customer messages from the contact form. A contact stays Waiting until someone replies.
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                    {STATUS_FILTERS.map((status) => {
                        const isActive = activeStatus === status;
                        return (
                            <Chip
                                key={status}
                                label={status}
                                clickable
                                onClick={() => handleStatusChange(status)}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem',
                                    borderRadius: 50,
                                    bgcolor: isActive ? BRAND_BLUE : '#ffffff',
                                    color: isActive ? '#ffffff' : theme.palette.grey[700],
                                    border: `1px solid ${
                                        isActive ? BRAND_BLUE : alpha(BRAND_BLUE, 0.2)
                                    }`,
                                    '&:hover': {
                                        bgcolor: isActive ? '#124578' : alpha(BRAND_BLUE, 0.06),
                                    },
                                }}
                            />
                        );
                    })}
                    {newCount > 0 && (
                        <Chip
                            label={`${newCount} waiting`}
                            sx={{
                                fontWeight: 700,
                                bgcolor: alpha(BRAND_BLUE, 0.1),
                                color: BRAND_BLUE,
                            }}
                        />
                    )}
                </Stack>

                <Card
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                        boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.06)}`,
                        overflow: 'hidden',
                    }}
                >
                    <Scrollbar>
                        <TableContainer sx={{ overflow: 'unset' }}>
                            {loading ? (
                                <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress sx={{ color: BRAND_BLUE }} />
                                </Box>
                            ) : notFound ? (
                                <Box sx={{ py: 10, textAlign: 'center' }}>
                                    <EmailOutlinedIcon
                                        sx={{
                                            fontSize: 48,
                                            color: alpha(BRAND_BLUE, 0.25),
                                            mb: 1.5,
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color: theme.palette.grey[800],
                                            mb: 0.5,
                                        }}
                                    >
                                        {activeStatus === 'All'
                                            ? 'No contact messages yet'
                                            : `No ${activeStatus.toLowerCase()} messages`}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Messages from the contact form will appear here.
                                    </Typography>
                                </Box>
                            ) : (
                                <Table sx={{ minWidth: 960 }}>
                                    <ContactsTableHead
                                        headLabel={[
                                            { id: 'fullName', label: 'Name', minWidth: 140 },
                                            { id: 'email', label: 'Email', minWidth: 180 },
                                            { id: 'orderNumber', label: 'Order #', minWidth: 100 },
                                            { id: 'message', label: 'Message', minWidth: 200 },
                                            { id: 'dateCreated', label: 'Date', minWidth: 160 },
                                            { id: 'contactStatus', label: 'Status', minWidth: 90 },
                                            { id: 'actions', label: '', width: 88 },
                                        ]}
                                    />
                                    <TableBody>
                                        {contacts.map((row) => (
                                            <ContactsTableRow
                                                key={row.id}
                                                row={row}
                                                onMarkedDone={fetchContacts}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </TableContainer>
                    </Scrollbar>

                    {!loading && contacts.length > 0 && (
                        <TablePagination
                            component="div"
                            page={page}
                            count={totalContacts}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[10, 20, 40]}
                            labelDisplayedRows={() => `${from}-${to} of ${totalContacts}`}
                            sx={{
                                borderTop: `1px solid ${theme.palette.grey[100]}`,
                                '& .MuiTablePagination-selectIcon': { color: BRAND_BLUE },
                            }}
                        />
                    )}
                </Card>
            </Stack>
        </DashboardContent>
    );
}
