import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, useTheme } from '@mui/material/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { getCurrentUser } from '../../../api';
import { getAllRoles, getAllUsers, type RoleOption, type UserContent } from '../../../api/user';
import { useRouter } from '../../../routes/hooks';
import {
    DEFAULT_USER_FILTERS,
    hasActiveUserFilters,
    roleLabel,
    UserFilters,
    type UserFiltersState,
} from '../user-filters';
import { UserTableHead } from '../user-table-head';
import { UserTableRow } from '../user-table-row';

const BRAND_BLUE = '#175195';

function sortRoles(roles: RoleOption[]) {
    const rank = (name: string) => {
        const key = name.toLowerCase();
        if (key === 'user') return 0;
        if (key === 'admin') return 1;
        return 2;
    };
    return [...roles].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
}

function buildFilter(filters: UserFiltersState, search: string, customersOnly: boolean) {
    const parts: string[] = [];

    if (filters.status === 'active') {
        parts.push('active:true');
    } else if (filters.status === 'inactive') {
        parts.push('active:false');
    }

    if (filters.provider === 'google') {
        parts.push('provider:GOOGLE');
    } else if (filters.provider === 'email') {
        parts.push('provider:LOCAL');
    }

    if (customersOnly) {
        parts.push('role.name:user');
    } else if (filters.role !== 'all') {
        parts.push(`role.name:${filters.role}`);
    }

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
        parts.push(`username:${trimmedSearch}`);
    }

    return parts.join(',');
}

export function UserView() {
    const theme = useTheme();
    const [searchParams] = useSearchParams();
    const router = useRouter();
    const customersOnly = getCurrentUser()?.role === 'ROLE_MANAGER';

    const initialPage = parseInt(searchParams.get('page') || '0', 10);
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [users, setUsers] = useState<UserContent[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [appliedFilters, setAppliedFilters] = useState<UserFiltersState>(DEFAULT_USER_FILTERS);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [roles, setRoles] = useState<RoleOption[]>([
        { id: 2, name: 'user' },
        { id: 1, name: 'admin' },
    ]);
    const [loading, setLoading] = useState(false);

    const filters = buildFilter(appliedFilters, searchQuery, customersOnly);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllUsers({
                page,
                size: rowsPerPage,
                filter: filters,
            });

            const total = response.totalElements;
            setTotalUsers(total);

            const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1);
            if (page > maxPage) {
                setPage(maxPage);
                router.push(`/user?page=${maxPage}`);
                return;
            }

            setUsers(response.content);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, filters, router]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        getAllRoles()
            .then((data) => {
                if (data.length > 0) {
                    setRoles(sortRoles(data));
                }
            })
            .catch((error) => {
                console.error('Failed to load roles', error);
            });
    }, []);

    const resetPage = useCallback(() => {
        setPage(0);
        router.push('/user?page=0');
    }, [router]);

    const isInitialSearch = useRef(true);

    useEffect(() => {
        if (isInitialSearch.current) {
            isInitialSearch.current = false;
            return undefined;
        }

        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            resetPage();
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, resetPage]);

    const handleApplyFilters = (nextFilters: UserFiltersState) => {
        setAppliedFilters(nextFilters);
        resetPage();
    };

    const handleResetFilters = () => {
        setAppliedFilters(DEFAULT_USER_FILTERS);
        setSearchInput('');
        setSearchQuery('');
        resetPage();
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
        router.push(`/user?page=${newPage}`);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        resetPage();
    };

    const from = totalUsers === 0 ? 0 : page * rowsPerPage + 1;
    const to = Math.min((page + 1) * rowsPerPage, totalUsers);
    const notFound = users.length === 0 && !loading;
    const hasFilters = hasActiveUserFilters(appliedFilters) || searchQuery.trim().length > 0;

    return (
        <DashboardContent maxWidth="xl" sx={{ mb: 4 }}>
            <Stack spacing={3}>
                {customersOnly && (
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', maxWidth: 560 }}>
                        Customer accounts.
                    </Typography>
                )}

                <Card
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                        boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.06)}`,
                        overflow: 'hidden',
                    }}
                >
                    {!customersOnly && (
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{
                            px: { xs: 2, md: 2.5 },
                            py: 1.75,
                            borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                        }}
                    >
                        {[{ id: 0, name: 'all' }, ...roles].map((role) => {
                            const selected = appliedFilters.role === role.name;
                            const label = roleLabel(role.name);
                            return (
                                <Button
                                    key={role.name}
                                    onClick={() => {
                                        setAppliedFilters((current) => ({ ...current, role: role.name }));
                                        resetPage();
                                    }}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        borderRadius: 50,
                                        px: 2,
                                        py: 0.5,
                                        minWidth: 0,
                                        bgcolor: selected ? BRAND_BLUE : '#ffffff',
                                        color: selected ? '#ffffff' : theme.palette.grey[800],
                                        border: `1px solid ${selected ? BRAND_BLUE : alpha(BRAND_BLUE, 0.2)}`,
                                        '&:hover': {
                                            bgcolor: selected ? '#124578' : alpha(BRAND_BLUE, 0.06),
                                        },
                                    }}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </Stack>
                    )}

                    <Box
                        sx={{
                            px: { xs: 2, md: 2.5 },
                            py: 1.75,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 1.5,
                            borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                            bgcolor: alpha(BRAND_BLUE, 0.02),
                        }}
                    >
                        <OutlinedInput
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by email…"
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: alpha(BRAND_BLUE, 0.5) }} />
                                </InputAdornment>
                            }
                            endAdornment={
                                searchInput ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setSearchInput('')}
                                            edge="end"
                                            aria-label="Clear search"
                                        >
                                            <CloseIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }
                            sx={{
                                width: '100%',
                                maxWidth: { sm: 360 },
                                bgcolor: '#ffffff',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(BRAND_BLUE, 0.2),
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: alpha(BRAND_BLUE, 0.4),
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: BRAND_BLUE,
                                },
                            }}
                        />

                        <UserFilters
                            filters={appliedFilters}
                            totalUsers={totalUsers}
                            open={filterOpen}
                            onOpen={() => setFilterOpen(true)}
                            onClose={() => setFilterOpen(false)}
                            onApply={handleApplyFilters}
                            onReset={handleResetFilters}
                        />
                    </Box>

                    <Scrollbar>
                        <TableContainer sx={{ overflow: 'unset' }}>
                            {loading ? (
                                <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress sx={{ color: BRAND_BLUE }} />
                                </Box>
                            ) : notFound ? (
                                <Box sx={{ py: 10, textAlign: 'center' }}>
                                    <PeopleOutlinedIcon
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
                                        {hasFilters ? 'No users match your filters' : 'No users yet'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                        {hasFilters
                                            ? 'Try a different search or adjust your filters.'
                                            : 'Registered accounts will appear here.'}
                                    </Typography>
                                    {hasFilters && (
                                        <Button
                                            onClick={() => {
                                                handleResetFilters();
                                                setFilterOpen(true);
                                            }}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                color: BRAND_BLUE,
                                            }}
                                        >
                                            Clear filters
                                        </Button>
                                    )}
                                </Box>
                            ) : (
                                <Table sx={{ minWidth: 1100 }}>
                                    <UserTableHead
                                        headLabel={[
                                            { id: 'user', label: 'User', minWidth: 260 },
                                            { id: 'phoneNumber', label: 'Phone', minWidth: 130 },
                                            { id: 'role', label: 'Role', minWidth: 100 },
                                            { id: 'active', label: 'Status', minWidth: 90 },
                                            { id: 'provider', label: 'Provider', minWidth: 90 },
                                            { id: 'orders', label: 'Orders', minWidth: 180 },
                                            { id: 'dateCreated', label: 'Joined', minWidth: 160 },
                                        ]}
                                    />
                                    <TableBody>
                                        {users.map((row) => (
                                            <UserTableRow
                                                key={row.userId}
                                                row={row}
                                                roles={roles}
                                                readOnly={customersOnly}
                                                onChanged={fetchUsers}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </TableContainer>
                    </Scrollbar>

                    {!loading && users.length > 0 && (
                        <TablePagination
                            component="div"
                            page={page}
                            count={totalUsers}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[10, 20, 40]}
                            labelDisplayedRows={() => `${from}-${to} of ${totalUsers}`}
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
