import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {createFaqUnderTitle, getFaqById, updateFaqUnderTitle} from '../../api/faq';
import { DashboardContent } from '../../layouts/dashboard';

export default function FaqForm() {
    const { titleId, faqId } = useParams();
    const navigate = useNavigate();

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const isEdit = Boolean(faqId);

    useEffect(() => {
        if (isEdit && faqId) {
            loadFaqData();
        }
    }, [faqId]);

    const loadFaqData = async () => {
        try {
            const data = await getFaqById(Number(faqId));
            setQuestion(data.question);
            setAnswer(data.answer);
        } catch (error) {
            console.error('Failed to load FAQ:', error);
        }
    };

    const handleSubmit = async () => {
        if (!question.trim() || !answer.trim()) return;

        try {
            setLoading(true);
            if (isEdit && faqId) {
                await updateFaqUnderTitle(Number(faqId), { question, answer });
            } else {
                await createFaqUnderTitle(Number(titleId), { question, answer });
            }
            navigate(-1);
        } catch (err) {
            console.error('Failed to save FAQ:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 3 }}>
                {isEdit ? 'Edit FAQ' : 'Create FAQ'}
            </Typography>
            <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <TextField
                        label="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        required
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                            {isEdit ? 'Update FAQ' : 'Add FAQ'}
                        </Button>
                    </Box>
                </Stack>
            </Card>
        </DashboardContent>
    );
}
