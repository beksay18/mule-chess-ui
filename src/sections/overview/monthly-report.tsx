import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { MonthlyOrderReport } from 'src/api/order';

const BRAND_BLUE = '#175195';

const cardSx = {
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'grey.200',
    boxShadow: 'none',
};

const money = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

const monthName = (month: number) =>
    new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' });

function yearMonths(rows: MonthlyOrderReport[], year: number) {
    return rows
        .filter((row) => row.year === year && Number(row.orderCount || 0) > 0)
        .sort((a, b) => a.month - b.month);
}

export function MonthlyReport({ rows, loading }: { rows: MonthlyOrderReport[]; loading: boolean }) {
    const years = [...new Set(rows.map((row) => row.year))].sort((a, b) => b - a);
    const [pickedYear, setPickedYear] = useState<number | null>(null);
    const selectedYear = pickedYear !== null && years.includes(pickedYear) ? pickedYear : years[0];
    const months = selectedYear ? yearMonths(rows, selectedYear) : [];
    const totalOrders = months.reduce((sum, row) => sum + Number(row.orderCount || 0), 0);
    const totalRevenue = months.reduce((sum, row) => sum + Number(row.revenue || 0), 0);

    return (
        <Paper elevation={0} sx={{ ...cardSx, overflow: 'hidden' }}>
            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 1.5,
                }}
            >
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Monthly report</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Orders that came in each month, and the money from orders that were not cancelled.
                    </Typography>
                </Box>
                {!loading && years.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {years.map((year) => {
                            const selected = year === selectedYear;
                            return (
                                <Button
                                    key={year}
                                    onClick={() => setPickedYear(year)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        borderRadius: 50,
                                        px: 2,
                                        py: 0.5,
                                        minWidth: 0,
                                        bgcolor: selected ? BRAND_BLUE : '#ffffff',
                                        color: selected ? '#ffffff' : 'grey.800',
                                        border: `1px solid ${selected ? BRAND_BLUE : alpha(BRAND_BLUE, 0.2)}`,
                                        '&:hover': {
                                            bgcolor: selected ? '#124578' : alpha(BRAND_BLUE, 0.06),
                                        },
                                    }}
                                >
                                    {year}
                                </Button>
                            );
                        })}
                    </Stack>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : years.length === 0 ? (
                <Typography color="text.secondary" sx={{ px: 2.5, pb: 3 }}>
                    No orders yet.
                </Typography>
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 2,
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            px: 2.5,
                            pb: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                ORDERS
                            </Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', lineHeight: 1.2 }}>
                                {totalOrders}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                REVENUE
                            </Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', lineHeight: 1.2 }}>
                                {money(totalRevenue)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="medium">
                            <TableHead>
                                <TableRow>
                                    {['Month', 'Orders', 'Revenue'].map((heading) => (
                                        <TableCell
                                            key={heading}
                                            align={heading === 'Month' ? 'left' : 'right'}
                                            sx={{ color: 'text.secondary', fontWeight: 700, borderColor: 'grey.100' }}
                                        >
                                            {heading}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {months.map((row) => (
                                    <TableRow key={`${row.year}-${row.month}`}>
                                        <TableCell sx={{ fontWeight: 700 }}>{monthName(row.month)}</TableCell>
                                        <TableCell align="right">{row.orderCount}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                                            {money(Number(row.revenue))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>
                                        {totalOrders}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800 }}>
                                        {money(totalRevenue)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </>
            )}
        </Paper>
    );
}
