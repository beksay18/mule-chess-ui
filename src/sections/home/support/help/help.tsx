import { useEffect, useMemo, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import HelpTitle from './help-title';
import { FaqTitle, getAllFaqs } from '../../../../api/faq';

const BRAND_BLUE = '#175195';

function getCategoryIcon(title: string) {
    const lower = title.toLowerCase();
    if (lower.includes('return')) return ReplayOutlinedIcon;
    if (lower.includes('ship')) return LocalShippingOutlinedIcon;
    if (lower.includes('sticker')) return StyleOutlinedIcon;
    return HelpOutlineIcon;
}

export default function Help() {
    const theme = useTheme();
    const [faqTitle, setFaqTitle] = useState<FaqTitle[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');
    const [expandedId, setExpandedId] = useState<number | false>(false);

    useEffect(() => {
        loadAllFaqs();
    }, []);

    const loadAllFaqs = async () => {
        const data = await getAllFaqs();
        setFaqTitle(data);
    };

    const visibleCategories = useMemo(() => {
        if (activeCategoryId === 'all') return faqTitle;
        return faqTitle.filter((item) => item.id === activeCategoryId);
    }, [faqTitle, activeCategoryId]);

    const handleAccordionChange = (faqId: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedId(isExpanded ? faqId : false);
    };

    const handleCategoryChange = (categoryId: number | 'all') => {
        setActiveCategoryId(categoryId);
        setExpandedId(false);
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', pb: { xs: 6, md: 8 } }}>
            <HelpTitle />

            <Container maxWidth="md">
                {faqTitle.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                        <HelpOutlineIcon sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.3), mb: 2 }} />
                        <Typography>No help articles yet — check back soon.</Typography>
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                justifyContent: 'center',
                            }}
                        >
                            <Chip
                                label="All topics"
                                onClick={() => handleCategoryChange('all')}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    px: 0.5,
                                    bgcolor: activeCategoryId === 'all' ? BRAND_BLUE : '#ffffff',
                                    color: activeCategoryId === 'all' ? '#ffffff' : BRAND_BLUE,
                                    border: `1.5px solid ${alpha(BRAND_BLUE, 0.35)}`,
                                    '&:hover': {
                                        bgcolor:
                                            activeCategoryId === 'all'
                                                ? '#124578'
                                                : alpha(BRAND_BLUE, 0.06),
                                    },
                                }}
                            />
                            {faqTitle.map((item) => {
                                const Icon = getCategoryIcon(item.title);
                                const isActive = activeCategoryId === item.id;
                                return (
                                    <Chip
                                        key={item.id}
                                        icon={
                                            <Icon
                                                sx={{
                                                    fontSize: 18,
                                                    color: `${isActive ? '#ffffff' : BRAND_BLUE} !important`,
                                                }}
                                            />
                                        }
                                        label={item.title}
                                        onClick={() => handleCategoryChange(item.id)}
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            px: 0.5,
                                            bgcolor: isActive ? BRAND_BLUE : '#ffffff',
                                            color: isActive ? '#ffffff' : BRAND_BLUE,
                                            border: `1.5px solid ${alpha(BRAND_BLUE, 0.35)}`,
                                            '&:hover': {
                                                bgcolor: isActive ? '#124578' : alpha(BRAND_BLUE, 0.06),
                                            },
                                        }}
                                    />
                                );
                            })}
                        </Box>

                        <Stack spacing={4}>
                            {visibleCategories.map((item) => {
                                const Icon = getCategoryIcon(item.title);
                                return (
                                    <Box key={item.id}>
                                        {activeCategoryId === 'all' && (
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={1.5}
                                                sx={{ mb: 2 }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: 2,
                                                        bgcolor: alpha(BRAND_BLUE, 0.08),
                                                        color: BRAND_BLUE,
                                                    }}
                                                >
                                                    <Icon sx={{ fontSize: 20 }} />
                                                </Box>
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        display: 'inline-block',
                                                        px: 1.75,
                                                        py: 0.5,
                                                        fontWeight: 800,
                                                        fontSize: '1rem',
                                                        color: BRAND_BLUE,
                                                        border: `2px dashed ${alpha(BRAND_BLUE, 0.28)}`,
                                                        borderRadius: 2,
                                                        transform: 'rotate(-1deg)',
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>
                                            </Stack>
                                        )}

                                        <Box
                                            sx={{
                                                borderRadius: 3,
                                                border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                                                overflow: 'hidden',
                                                bgcolor: '#ffffff',
                                                boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.06)}`,
                                            }}
                                        >
                                            {item.faqs.map((faq, faqIndex) => {
                                                const isExpanded = expandedId === faq.id;
                                                const isLast = faqIndex === item.faqs.length - 1;

                                                return (
                                                    <Accordion
                                                        key={faq.id}
                                                        expanded={isExpanded}
                                                        onChange={handleAccordionChange(faq.id)}
                                                        disableGutters
                                                        elevation={0}
                                                        sx={{
                                                            bgcolor: 'transparent',
                                                            '&:before': { display: 'none' },
                                                            borderBottom: isLast
                                                                ? 'none'
                                                                : `1px solid ${theme.palette.grey[100]}`,
                                                            '&.Mui-expanded': {
                                                                bgcolor: alpha(BRAND_BLUE, 0.03),
                                                                boxShadow: `inset 3px 0 0 ${BRAND_BLUE}`,
                                                            },
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={
                                                                <Box
                                                                    sx={{
                                                                        width: 28,
                                                                        height: 28,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        borderRadius: '50%',
                                                                        bgcolor: isExpanded
                                                                            ? BRAND_BLUE
                                                                            : alpha(BRAND_BLUE, 0.08),
                                                                        color: isExpanded
                                                                            ? '#ffffff'
                                                                            : BRAND_BLUE,
                                                                        transition: 'all 0.2s ease',
                                                                    }}
                                                                >
                                                                    {isExpanded ? (
                                                                        <RemoveIcon sx={{ fontSize: 18 }} />
                                                                    ) : (
                                                                        <AddIcon sx={{ fontSize: 18 }} />
                                                                    )}
                                                                </Box>
                                                            }
                                                            sx={{
                                                                px: { xs: 2, md: 2.5 },
                                                                py: 0.5,
                                                                '& .MuiAccordionSummary-content': {
                                                                    my: 1.5,
                                                                    alignItems: 'center',
                                                                    gap: 1.5,
                                                                },
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    flexShrink: 0,
                                                                    fontWeight: 800,
                                                                    fontSize: '0.8125rem',
                                                                    color: alpha(BRAND_BLUE, 0.55),
                                                                    letterSpacing: '0.04em',
                                                                }}
                                                            >
                                                                Q{faqIndex + 1}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    fontSize: '0.975rem',
                                                                    color: theme.palette.grey[900],
                                                                    lineHeight: 1.5,
                                                                }}
                                                            >
                                                                {faq.question}
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            sx={{
                                                                px: { xs: 2, md: 2.5 },
                                                                pt: 0,
                                                                pb: 2.5,
                                                                pl: { xs: 5.5, md: 6.5 },
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    fontSize: '0.9375rem',
                                                                    lineHeight: 1.75,
                                                                }}
                                                            >
                                                                {faq.answer}
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
