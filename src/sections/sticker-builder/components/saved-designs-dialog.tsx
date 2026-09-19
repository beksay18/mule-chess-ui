import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { alpha } from '@mui/material/styles';

import type { StickerBuilderApi } from '../hooks/use-sticker-builder';

type SavedDesignsDialogProps = {
    open: boolean;
    onClose: () => void;
    api: StickerBuilderApi;
};

export function SavedDesignsDialog({ open, onClose, api }: SavedDesignsDialogProps) {
    const { savedDesigns, loadDesign, renameDesign, removeDesign, duplicateDesign, startNewDesign } = api;
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [nameDraft, setNameDraft] = useState('');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Saved designs
                <Button
                    onClick={() => {
                        startNewDesign();
                        onClose();
                    }}
                    sx={{ textTransform: 'none' }}
                >
                    New design
                </Button>
            </DialogTitle>
            <DialogContent>
                {savedDesigns.length === 0 && (
                    <Typography color="text.secondary">You have not saved a design yet.</Typography>
                )}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                    }}
                >
                    {savedDesigns.map((record) => (
                        <Box
                            key={record.id}
                            sx={{
                                border: `1px solid ${alpha('#0f172a', 0.08)}`,
                                borderRadius: 2,
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    height: 140,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: '#f3f4f6',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    loadDesign(record.id);
                                    onClose();
                                }}
                            >
                                {record.previewUrl ? (
                                    <Box
                                        component="img"
                                        src={record.previewUrl}
                                        alt={record.name}
                                        sx={{ maxWidth: '80%', maxHeight: 120 }}
                                    />
                                ) : (
                                    <Typography color="text.secondary">No preview</Typography>
                                )}
                            </Box>
                            <Box sx={{ p: 1.5 }}>
                                {renamingId === record.id ? (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={nameDraft}
                                        onChange={(event) => setNameDraft(event.target.value)}
                                        onBlur={() => {
                                            renameDesign(nameDraft, record.id);
                                            setRenamingId(null);
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <Typography fontWeight={700} noWrap>
                                        {record.name}
                                    </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                    Updated {new Date(record.updatedAt).toLocaleDateString()}
                                </Typography>
                                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                                    <Button
                                        size="small"
                                        startIcon={<EditOutlinedIcon />}
                                        onClick={() => {
                                            loadDesign(record.id);
                                            onClose();
                                        }}
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
                                    <IconButton size="small" onClick={() => duplicateDesign(record.id)}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => removeDesign(record.id)}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
