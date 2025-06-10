import Grid from '@mui/material/Grid';
import { DashboardContent } from 'src/layouts/dashboard';
import Button from "@mui/material/Button";
import { Iconify } from "../../../components/iconify";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useRouter } from 'src/routes/hooks';
import { FaqItem, FaqItemProps } from '../faq-item';
import { deleteFaqTitle, FaqTitle, getAllFaqs } from "../../../api/faq";

// ----------------------------------------------------------------------

function mapToFaqItem(
    faqTitle: FaqTitle,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
    onAddFaq: (id: number) => void
): FaqItemProps {
    return {
        id: faqTitle.id,
        title: faqTitle.title,
        faqs: faqTitle.faqs,
        onEdit,
        onDelete,
        onAddFaq
    };
}

export function FaqView() {
    const router = useRouter();
    const [faqTitle, setFaqTitle] = useState<FaqTitle[]>([]);

    useEffect(() => {
        loadAllFaqs();
    }, []);

    const loadAllFaqs = async () => {
        const data = await getAllFaqs();
        setFaqTitle(data);
    };

    const handleEdit = (id: number) => {
        router.push(`/faq/faq-title-form/${id}`);
    };

    const handleAddFaq = (titleId: number) => {
        router.push(`/faq/faq-form/${titleId}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this FAQ Title?')) {
            try {
                await deleteFaqTitle(id);
                loadAllFaqs();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => router.push('faq-title-form')}
                >
                    New FAQ Title
                </Button>
            </Box>

            <Grid container spacing={2}>
                {faqTitle.map((item) => (
                    <FaqItem key={item.id} {...mapToFaqItem(item, handleEdit, handleDelete, handleAddFaq)} />
                ))}
            </Grid>
        </DashboardContent>
    );
}
