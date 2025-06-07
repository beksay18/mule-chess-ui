import {useState, useCallback} from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {useRouter} from "../../routes/hooks";
import {Label} from "../../components/label";
import {markContactAsDone} from "../../api/contacts";
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------
export type ContactsProps = {
    id: number;
    name: string,
    email: string,
    orderNumber: string,
    message: string,
    fileUrl: string,
    dateCreated: string,
    contactStatus: string,
};

type ContactsTableRowProps = {
    row: ContactsProps;
    selected: boolean;
    onSelectRow: () => void;
    currentPage: number;
};

export function ContactsTableRow({row, selected, onSelectRow, currentPage}: ContactsTableRowProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleMarkAsDone = async () => {
        try {
            setIsLoading(true);
            await markContactAsDone(row.id);
            setConfirmOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to mark as done', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}
                      sx={{
                          cursor: 'pointer',
                          backgroundColor: row.contactStatus?.toLowerCase() === 'new' ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                      }}
            >
                <TableCell>{row.name}</TableCell>

                <TableCell>{row.email}</TableCell>

                <TableCell>{row.orderNumber}</TableCell>

                <TableCell>{row.message}</TableCell>

                <TableCell>{new Date(row.dateCreated).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })}</TableCell>

                <TableCell>
                    <Label
                        color={
                            row.contactStatus?.toLowerCase() === 'new'
                                ? 'primary'
                                : 'success'
                        }
                    >
                        {row.contactStatus ?? 'Unknown'}
                    </Label>
                </TableCell>

                <TableCell>
                    {row.contactStatus?.toLowerCase() === 'new' && (
                        <IconButton color="primary" onClick={() => setConfirmOpen(true)}>
                           <DoneIcon />
                        </IconButton>
                    )}
                </TableCell>

            </TableRow>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Mark as Done</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to mark this contact as done?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleMarkAsDone} color="primary" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
