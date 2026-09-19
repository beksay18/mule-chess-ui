import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import GridOnIcon from '@mui/icons-material/GridOn';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { alpha } from '@mui/material/styles';

import type { StickerBuilderApi } from '../hooks/use-sticker-builder';
import { MAX_ZOOM, MIN_ZOOM, BRAND_BLUE } from '../constants';

type BuilderToolbarProps = {
    api: StickerBuilderApi;
    onOpenDesigns: () => void;
    onSave: () => void;
};

export function BuilderToolbar({ api, onOpenDesigns, onSave }: BuilderToolbarProps) {
    const {
        design,
        renameDesign,
        canUndo,
        canRedo,
        undo,
        redo,
        duplicateSelected,
        deleteSelected,
        zoom,
        setZoom,
        snapToGrid,
        setSnapToGrid,
        alignSelected,
        resetDesign,
        selected,
    } = api;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: { xs: 1, md: 2 },
                py: 1,
                borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                bgcolor: '#ffffff',
                minHeight: 64,
                flexWrap: 'wrap',
            }}
        >
            <TextField
                size="small"
                value={design.name}
                onChange={(event) => renameDesign(event.target.value)}
                sx={{ width: { xs: 140, md: 200 } }}
            />

            <Stack direction="row" spacing={0.25}>
                <Tooltip title="Undo (⌘Z)">
                    <span>
                        <IconButton disabled={!canUndo} onClick={undo}>
                            <UndoIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Redo (⌘⇧Z)">
                    <span>
                        <IconButton disabled={!canRedo} onClick={redo}>
                            <RedoIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Duplicate (⌘D)">
                    <span>
                        <IconButton disabled={!selected} onClick={duplicateSelected}>
                            <ContentCopyIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Delete">
                    <span>
                        <IconButton disabled={!selected || selected.locked} onClick={deleteSelected}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Align horizontally">
                    <span>
                        <IconButton disabled={!selected} onClick={() => alignSelected('center')}>
                            <AlignHorizontalCenterIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Align vertically">
                    <span>
                        <IconButton disabled={!selected} onClick={() => alignSelected('middle')}>
                            <AlignVerticalCenterIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Snap to grid">
                    <IconButton
                        color={snapToGrid ? 'primary' : 'default'}
                        onClick={() => setSnapToGrid(!snapToGrid)}
                    >
                        <GridOnIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Reset design">
                    <IconButton onClick={resetDesign}>
                        <RestartAltIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Stack direction="row" spacing={0.25} alignItems="center" sx={{ ml: { md: 'auto' } }}>
                <IconButton onClick={() => setZoom(Math.max(MIN_ZOOM, Number((zoom - 0.1).toFixed(2))))}>
                    <ZoomOutIcon />
                </IconButton>
                <Typography sx={{ minWidth: 48, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>
                    {Math.round(zoom * 100)}%
                </Typography>
                <IconButton onClick={() => setZoom(Math.min(MAX_ZOOM, Number((zoom + 0.1).toFixed(2))))}>
                    <ZoomInIcon />
                </IconButton>
                <Button
                    startIcon={<FolderOpenIcon />}
                    onClick={onOpenDesigns}
                    sx={{ textTransform: 'none', display: { xs: 'none', sm: 'inline-flex' } }}
                >
                    Designs
                </Button>
                <Button
                    startIcon={<SaveOutlinedIcon />}
                    onClick={onSave}
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: alpha(BRAND_BLUE, 0.3),
                        color: BRAND_BLUE,
                    }}
                >
                    Save
                </Button>
            </Stack>
        </Box>
    );
}
