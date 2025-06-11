import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Stack,
    Box,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

export type FaqItemProps = {
    id: number;
    title: string;
    faqs: {
        id: number;
        question: string;
        answer: string;
    }[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onAddFaq: (id: number) => void;
    onEditFaq: (faqId: number, titleId: number) => void;
    onDeleteFaq: (faqId: number) => void;
};

export function FaqItem({ id, title, faqs, onEdit, onDelete, onAddFaq, onEditFaq, onDeleteFaq }: FaqItemProps) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography color="primary" variant="h6">{title}</Typography>
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => onAddFaq(id)}><AddIcon /></IconButton>
                        <IconButton onClick={() => onEdit(id)}><EditIcon /></IconButton>
                        <IconButton onClick={() => onDelete(id)}><DeleteIcon /></IconButton>
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {faqs.map((faq) => (
                    <Accordion key={faq.id} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Typography variant="subtitle1">Q: {faq.question}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton onClick={() => onEditFaq(faq.id, id)} size="small">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => onDeleteFaq(faq.id)} size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="text.secondary">
                                A: {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </CardContent>
        </Card>
    );
}
