import React, {useEffect, useState} from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Card, CardContent,
    Container, Divider, IconButton, Stack, Typography,
} from '@mui/material';
import HelpTitle from "./help-title";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {FaqTitle, getAllFaqs} from "../../../../api/faq";
import {Masonry} from "@mui/lab";

export default function Help() {
    const [faqTitle, setFaqTitle] = useState<FaqTitle[]>([]);

    useEffect(() => {
        loadAllFaqs();
    }, []);

    const loadAllFaqs = async () => {
        const data = await getAllFaqs();
        setFaqTitle(data);
    };

    return (
        <>
            <HelpTitle/>
            <Container sx={{py: 5}}>
                <Masonry columns={2} spacing={2}>
                    {faqTitle.map((item) => (
                        <Card variant="outlined">
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography color="secondary" variant="h6">{item.title}</Typography>

                                </Stack>

                                {item.faqs.map((faq) => (
                                    <Accordion key={faq.id} disableGutters>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}>
                                                <Typography variant="subtitle1">Q: {faq.question}</Typography>
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
                    ))}
                </Masonry>
            </Container>
        </>
    );
}
