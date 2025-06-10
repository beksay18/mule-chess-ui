import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Card,
    Stack,
    TextField,
    Typography,
    Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardContent } from '../../layouts/dashboard';
import {
    createFaqTitle,
    getFaqTitleById, updateFaqTitle
} from '../../api/faq';
import { FaqTitleRequest } from '../../api/faq/type';

export default function FaqTitleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [formData, setFormData] = useState<FaqTitleRequest>({
        title: '',
    });

    useEffect(() => {
        if (id) {
            loadTitle(Number(id));
        }
    }, [id]);

    const loadTitle = async (titleId: number) => {
        const data = await getFaqTitleById(titleId);
        setFormData({ title: data.title });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        if (!formData.title.trim()) return;

        try {
            if (id) {
                await updateFaqTitle(Number(id), formData);
            } else {
                await createFaqTitle(formData);
            }
            navigate('/faq');
        } catch (err) {
            console.error('Failed to submit', err);
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 3 }}>
                {id ? 'Edit FAQ Title' : 'Create FAQ Title'}
            </Typography>

            <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <TextField
                        label="FAQ Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={submitAttempted && !formData.title.trim()}
                        helperText={
                            submitAttempted && !formData.title.trim() ? 'Title is required' : ''
                        }
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!formData.title.trim()}
                        >
                            {id ? 'Update' : 'Create'}
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </DashboardContent>
    );
}
