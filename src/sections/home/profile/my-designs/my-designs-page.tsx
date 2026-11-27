import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { alpha } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { BRAND_BLUE } from '../../../sticker-builder/constants';
import {
    listSavedDesigns,
    deleteSavedDesign,
    renameSavedDesign,
    duplicateSavedDesign,
} from '../../../sticker-builder/storage';

export default function MyDesignsPage() {
    const router = useRouter();
    const [designs, setDesigns] = useState(() => listSavedDesigns());
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [nameDraft, setNameDraft] = useState('');

    const refresh = () => setDesigns(listSavedDesigns());

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>
                        My designs
                    </Typography>
                    <Typography color="text.secondary">
                        Reopen, rename, duplicate, or delete sticker designs saved in this browser.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => router.push('/sticker-builder')}
                    sx={{ bgcolor: BRAND_BLUE, textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}
                >
                    New design
                </Button>
            </Stack>

            {designs.length === 0 && (
                <Typography color="text.secondary">No saved designs yet. Start one in the Mule Chess Builder.</Typography>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                }}
            >
                {designs.map((record) => (
                    <Box
                        key={record.id}
                        sx={{
                            border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                height: 160,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f8fafc',
                                cursor: 'pointer',
                            }}
                            onClick={() => router.push(`/sticker-builder?design=${record.id}`)}
                        >
                            {record.previewUrl ? (
                                <Box
                                    component="img"
                                    src={record.previewUrl}
                                    alt={record.name}
                                    sx={{ maxWidth: '80%', maxHeight: 140 }}
                                />
                            ) : (
                                <Typography color="text.secondary">No preview</Typography>
                            )}
                        </Box>
                        <Box sx={{ p: 2 }}>
                            {renamingId === record.id ? (
                                <TextField
                                    size="small"
                                    fullWidth
                                    value={nameDraft}
                                    autoFocus
                                    onChange={(event) => setNameDraft(event.target.value)}
                                    onBlur={() => {
                                        renameSavedDesign(record.id, nameDraft);
                                        setRenamingId(null);
                                        refresh();
                                    }}
                                />
                            ) : (
                                <Typography fontWeight={700}>{record.name}</Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                                Updated {new Date(record.updatedAt).toLocaleString()}
                            </Typography>
                            <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                                <Button
                                    size="small"
                                    startIcon={<EditOutlinedIcon />}
                                    onClick={() => router.push(`/sticker-builder?design=${record.id}`)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Edit
                                </Button>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setRenamingId(record.id);
                                        setNameDraft(record.name);
                                    }}
                                >
                                    <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        duplicateSavedDesign(record.id);
                                        refresh();
                                    }}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        deleteSavedDesign(record.id);
                                        refresh();
                                    }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
