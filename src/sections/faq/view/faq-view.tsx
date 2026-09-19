import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import { deleteFaq, deleteFaqTitle, FaqTitle, getAllFaqs } from '../../../api/faq';
import { FaqItem, FaqItemProps } from '../faq-item';

const BRAND_BLUE = '#175195';

function mapToFaqItem(
    faqTitle: FaqTitle,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
    onAddFaq: (id: number) => void,
    onEditFaq: (faqId: number, titleId: number) => void,
    onDeleteFaq: (faqId: number) => void
): FaqItemProps {
    return {
        id: faqTitle.id,
        title: faqTitle.title,
        faqs: faqTitle.faqs,
        onEdit,
        onDelete,
        onAddFaq,
        onEditFaq,
        onDeleteFaq,
    };
}

export function FaqView() {
    const theme = useTheme();
    const router = useRouter();
    const [faqTitle, setFaqTitle] = useState<FaqTitle[]>([]);
    const [loading, setLoading] = useState(true);

    const totalQuestions = useMemo(
        () => faqTitle.reduce((sum, item) => sum + item.faqs.length, 0),
        [faqTitle]
    );

    useEffect(() => {
        loadAllFaqs();
    }, []);

    const loadAllFaqs = async () => {
        setLoading(true);
        try {
            const data = await getAllFaqs();
            setFaqTitle(data);
        } catch (err) {
            console.error('Failed to load FAQs', err);
            setFaqTitle([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/faq/faq-title-form/${id}`);
    };

    const handleAddFaq = (titleId: number) => {
        router.push(`/faq/faq-form/${titleId}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this FAQ category and all its questions?')) {
            try {
                await deleteFaqTitle(id);
                loadAllFaqs();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEditFaq = (faqId: number, titleId: number) => {
        router.push(`/faq/faq-form/${titleId}/${faqId}`);
    };

    const handleDeleteFaq = async (faqId: number) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteFaq(faqId);
                loadAllFaqs();
            } catch (err) {
                console.error('Failed to delete FAQ:', err);
            }
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Stack spacing={3}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', maxWidth: 480 }}>
                        Organize help topics and questions shown on the public Help page.
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/faq/faq-title-form')}
                        sx={{
                            flexShrink: 0,
                            px: 2.5,
                            py: 1,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            borderRadius: 50,
                            bgcolor: BRAND_BLUE,
                            textTransform: 'none',
                            boxShadow: `0 4px 16px ${alpha(BRAND_BLUE, 0.25)}`,
                            '&:hover': { bgcolor: '#124578' },
                        }}
                    >
                        New category
                    </Button>
                </Box>

                {!loading && faqTitle.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                            label={`${faqTitle.length} ${faqTitle.length === 1 ? 'category' : 'categories'}`}
                            sx={{
                                fontWeight: 600,
                                bgcolor: alpha(BRAND_BLUE, 0.08),
                                color: BRAND_BLUE,
                            }}
                        />
                        <Chip
                            label={`${totalQuestions} total questions`}
                            sx={{
                                fontWeight: 600,
                                bgcolor: alpha(BRAND_BLUE, 0.08),
                                color: BRAND_BLUE,
                            }}
                        />
                    </Stack>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: BRAND_BLUE }} />
                    </Box>
                ) : faqTitle.length > 0 ? (
                    <Grid container spacing={3}>
                        {faqTitle.map((item) => (
                            <Grid key={item.id} size={{ xs: 12, lg: 6 }}>
                                <FaqItem
                                    {...mapToFaqItem(
                                        item,
                                        handleEdit,
                                        handleDelete,
                                        handleAddFaq,
                                        handleEditFaq,
                                        handleDeleteFaq
                                    )}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            py: 10,
                            textAlign: 'center',
                            borderRadius: 3,
                            border: `1px dashed ${alpha(BRAND_BLUE, 0.2)}`,
                            bgcolor: alpha(BRAND_BLUE, 0.02),
                        }}
                    >
                        <QuizOutlinedIcon
                            sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.25), mb: 1.5 }}
                        />
                        <Typography sx={{ fontWeight: 700, color: theme.palette.grey[800], mb: 0.5 }}>
                            No FAQ categories yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                            Create a category to start adding help questions for your customers.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/faq/faq-title-form')}
                            sx={{
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 50,
                                color: BRAND_BLUE,
                                borderColor: alpha(BRAND_BLUE, 0.35),
                                '&:hover': {
                                    borderColor: BRAND_BLUE,
                                    bgcolor: alpha(BRAND_BLUE, 0.04),
                                },
                            }}
                        >
                            Create first category
                        </Button>
                    </Box>
                )}
            </Stack>
        </DashboardContent>
    );
}
