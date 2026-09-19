import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

const BRAND_BLUE = '#175195';

type HeadLabel = {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    minWidth?: number | string;
};

type ContactsTableHeadProps = {
    headLabel: HeadLabel[];
};

export function ContactsTableHead({ headLabel }: ContactsTableHeadProps) {
    return (
        <TableHead>
            <TableRow
                sx={{
                    bgcolor: alpha(BRAND_BLUE, 0.04),
                    '& .MuiTableCell-head': {
                        borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                    },
                }}
            >
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id || headCell.label}
                        align={headCell.align || 'left'}
                        sx={{ width: headCell.width, minWidth: headCell.minWidth, py: 1.75 }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                color: BRAND_BLUE,
                            }}
                        >
                            {headCell.label}
                        </Typography>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
