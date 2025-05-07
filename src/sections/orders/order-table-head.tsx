import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';

type HeadLabel = {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    minWidth?: number | string;
};

type OrderTableHeadProps = {
    headLabel: HeadLabel[];
};

export function OrderTableHead({ headLabel }: OrderTableHeadProps) {
    return (
        <TableHead>
            <TableRow>
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align || 'left'}
                        sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
