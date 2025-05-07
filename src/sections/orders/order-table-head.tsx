import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './utils';

type HeadLabel = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  minWidth?: number | string;
};

type UserTableHeadProps = {
  orderBy: string;
  order: 'asc' | 'desc';
  onSort: (id: string) => void;
  headLabel: HeadLabel[];
};

export function OrderTableHead({
                                order,
                                orderBy,
                                onSort,
                                headLabel,
                              }: UserTableHeadProps) {
  return (
      <TableHead>
        <TableRow>
          {headLabel.map((headCell) => (
              <TableCell
                  key={headCell.id}
                  align={headCell.align || 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ width: headCell.width, minWidth: headCell.minWidth }}
              >
                <TableSortLabel
                    hideSortIcon
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => onSort(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id && (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                  )}
                </TableSortLabel>
              </TableCell>
          ))}
        </TableRow>
      </TableHead>
  );
}
