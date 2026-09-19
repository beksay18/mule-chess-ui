import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import { alpha, useTheme } from '@mui/material/styles';

const BRAND_BLUE = '#175195';

function getCategoryIcon(title: string) {
    const lower = title.toLowerCase();
    if (lower.includes('return')) return ReplayOutlinedIcon;
    if (lower.includes('ship')) return LocalShippingOutlinedIcon;
    if (lower.includes('sticker')) return StyleOutlinedIcon;
    return HelpOutlineIcon;
}

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

export function FaqItem({
    id,
    title,
    faqs,
    onEdit,
    onDelete,
    onAddFaq,
    onEditFaq,
    onDeleteFaq,
}: FaqItemProps) {
    const theme = useTheme();
    const [expandedId, setExpandedId] = useState<number | false>(false);
    const CategoryIcon = getCategoryIcon(title);

    const handleAccordionChange = (faqId: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedId(isExpanded ? faqId : false);
    };

    return (
        <Box
            sx={{
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                bgcolor: '#ffffff',
                boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.06)}`,
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    bgcolor: alpha(BRAND_BLUE, 0.03),
                    borderBottom: `1px solid ${theme.palette.grey[100]}`,
                }}
            >
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(BRAND_BLUE, 0.1),
                            color: BRAND_BLUE,
                        }}
                    >
                        <CategoryIcon sx={{ fontSize: 22 }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '1.0625rem',
                                    color: theme.palette.grey[900],
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {title}
                            </Typography>
                            <Chip
                                label={`${faqs.length} ${faqs.length === 1 ? 'question' : 'questions'}`}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontWeight: 700,
                                    fontSize: '0.6875rem',
                                    bgcolor: alpha(BRAND_BLUE, 0.1),
                                    color: BRAND_BLUE,
                                }}
                            />
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
                        <Tooltip title="Add question">
                            <IconButton
                                size="small"
                                onClick={() => onAddFaq(id)}
                                sx={{ color: BRAND_BLUE }}
                            >
                                <PostAddOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit category">
                            <IconButton size="small" onClick={() => onEdit(id)} sx={{ color: BRAND_BLUE }}>
                                <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                            <IconButton
                                size="small"
                                onClick={() => onDelete(id)}
                                sx={{ color: theme.palette.error.main }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>

            {faqs.length === 0 ? (
                <Box sx={{ px: 2.5, py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        No questions in this category yet.
                    </Typography>
                    <Chip
                        icon={<AddIcon sx={{ fontSize: '16px !important' }} />}
                        label="Add first question"
                        clickable
                        onClick={() => onAddFaq(id)}
                        sx={{
                            fontWeight: 600,
                            bgcolor: alpha(BRAND_BLUE, 0.08),
                            color: BRAND_BLUE,
                            '&:hover': { bgcolor: alpha(BRAND_BLUE, 0.14) },
                        }}
                    />
                </Box>
            ) : (
                faqs.map((faq, faqIndex) => {
                    const isExpanded = expandedId === faq.id;
                    const isLast = faqIndex === faqs.length - 1;

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
                                borderBottom: isLast ? 'none' : `1px solid ${theme.palette.grey[100]}`,
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
                                            bgcolor: isExpanded ? BRAND_BLUE : alpha(BRAND_BLUE, 0.08),
                                            color: isExpanded ? '#ffffff' : BRAND_BLUE,
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
                                    px: 2,
                                    py: 0.25,
                                    '& .MuiAccordionSummary-content': {
                                        my: 1.25,
                                        alignItems: 'center',
                                        gap: 1,
                                        minWidth: 0,
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        flexShrink: 0,
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        color: alpha(BRAND_BLUE, 0.55),
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    Q{faqIndex + 1}
                                </Typography>
                                <Typography
                                    sx={{
                                        flex: 1,
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        color: theme.palette.grey[900],
                                        lineHeight: 1.45,
                                        pr: 1,
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={0.25}
                                    sx={{ flexShrink: 0, mr: 0.5 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Tooltip title="Edit question">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEditFaq(faq.id, id)}
                                            sx={{ color: BRAND_BLUE }}
                                        >
                                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete question">
                                        <IconButton
                                            size="small"
                                            onClick={() => onDeleteFaq(faq.id)}
                                            sx={{ color: theme.palette.error.main }}
                                        >
                                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 2, pt: 0, pb: 2, pl: 5 }}>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    );
                })
            )}
        </Box>
    );
}
