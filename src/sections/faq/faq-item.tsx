import {Card, CardContent, Typography, IconButton, Stack, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";

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
};

export function FaqItem({ id, title, faqs, onEdit, onDelete, onAddFaq }: FaqItemProps) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{title}</Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onAddFaq(id)}
                        >
                            + Add FAQ
                        </Button>
                        <IconButton onClick={() => onEdit(id)}><EditIcon /></IconButton>
                        <IconButton onClick={() => onDelete(id)}><DeleteIcon /></IconButton>
                    </Stack>
                </Stack>

                {faqs.map((faq) => (
                    <Box key={faq.id} mt={2}>
                        <Typography variant="subtitle1">Q: {faq.question}</Typography>
                        <Typography variant="body2" color="text.secondary">A: {faq.answer}</Typography>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}
