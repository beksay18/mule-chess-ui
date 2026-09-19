import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import TitleIcon from '@mui/icons-material/Title';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import type { StickerBuilderApi } from '../hooks/use-sticker-builder';
import { EMOJI_SET, BRAND_BLUE, STICKER_ICONS, ADDABLE_SHAPES } from '../constants';

type LeftTab = 'text' | 'upload' | 'emoji' | 'shapes' | 'icons';

const TABS: { id: LeftTab; label: string; icon: typeof TitleIcon }[] = [
    { id: 'text', label: 'Text', icon: TitleIcon },
    { id: 'upload', label: 'Upload', icon: CloudUploadOutlinedIcon },
    { id: 'emoji', label: 'Emoji', icon: EmojiEmotionsOutlinedIcon },
    { id: 'shapes', label: 'Shapes', icon: CategoryOutlinedIcon },
    { id: 'icons', label: 'Icons', icon: AutoAwesomeOutlinedIcon },
];

type LeftSidebarProps = {
    api: StickerBuilderApi;
};

export function LeftSidebar({ api }: LeftSidebarProps) {
    const [tab, setTab] = useState<LeftTab>('text');
    const [customText, setCustomText] = useState('My Sticker');
    const fileRef = useRef<HTMLInputElement | null>(null);

    return (
        <Box
            sx={{
                width: { md: 280 },
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                borderRight: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                bgcolor: '#ffffff',
                minHeight: 0,
            }}
        >
            <Tabs
                value={tab}
                onChange={(_, value: LeftTab) => setTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    minHeight: 56,
                    px: 1,
                    borderBottom: `1px solid ${alpha('#0f172a', 0.06)}`,
                    '& .MuiTab-root': {
                        minHeight: 56,
                        minWidth: 56,
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                    },
                }}
            >
                {TABS.map((item) => (
                    <Tab key={item.id} value={item.id} icon={<item.icon sx={{ fontSize: 18 }} />} label={item.label} />
                ))}
            </Tabs>

            <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
                {tab === 'text' && (
                    <Stack spacing={2}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            Add text
                        </Typography>
                        <TextField
                            size="small"
                            value={customText}
                            onChange={(event) => setCustomText(event.target.value)}
                            placeholder="Your text"
                        />
                        <Button
                            variant="contained"
                            startIcon={<TitleIcon />}
                            onClick={() => api.addText(customText)}
                            sx={{ bgcolor: BRAND_BLUE, textTransform: 'none', fontWeight: 700 }}
                        >
                            Add text
                        </Button>
                        <Typography variant="caption" color="text.secondary">
                            Double-click text on the canvas to edit it. Use the right panel for font, curve, and outline.
                        </Typography>
                    </Stack>
                )}

                {tab === 'upload' && (
                    <Stack spacing={2}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            Upload artwork
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            PNG, JPG, or WebP. Transparent PNGs print best for die-cut stickers.
                        </Typography>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            hidden
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) void api.addImageFile(file);
                                event.target.value = '';
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<ImageOutlinedIcon />}
                            onClick={() => fileRef.current?.click()}
                            sx={{ bgcolor: BRAND_BLUE, textTransform: 'none', fontWeight: 700 }}
                        >
                            Upload image
                        </Button>
                    </Stack>
                )}

                {tab === 'emoji' && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 1,
                        }}
                    >
                        {EMOJI_SET.map((emoji) => (
                            <Button
                                key={emoji}
                                onClick={() => api.addEmoji(emoji)}
                                sx={{
                                    minWidth: 0,
                                    fontSize: 24,
                                    border: `1px solid ${alpha('#0f172a', 0.08)}`,
                                    borderRadius: 1.5,
                                }}
                            >
                                {emoji}
                            </Button>
                        ))}
                    </Box>
                )}

                {tab === 'shapes' && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                        {ADDABLE_SHAPES.map((shape) => (
                            <Button
                                key={shape.id}
                                onClick={() => api.addShape(shape.id)}
                                sx={{
                                    textTransform: 'none',
                                    border: `1px solid ${alpha('#0f172a', 0.08)}`,
                                    color: BRAND_BLUE,
                                    fontWeight: 600,
                                }}
                            >
                                {shape.label}
                            </Button>
                        ))}
                    </Box>
                )}

                {tab === 'icons' && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                        {STICKER_ICONS.map((icon) => (
                            <Button
                                key={icon.id}
                                onClick={() => api.addIcon(icon.id)}
                                sx={{
                                    minWidth: 0,
                                    flexDirection: 'column',
                                    gap: 0.5,
                                    py: 1.25,
                                    border: `1px solid ${alpha('#0f172a', 0.08)}`,
                                    color: BRAND_BLUE,
                                    textTransform: 'none',
                                }}
                            >
                                <Box
                                    component="svg"
                                    viewBox={icon.viewBox}
                                    sx={{ width: 22, height: 22 }}
                                >
                                    <path
                                        d={icon.path}
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1.1"
                                    />
                                </Box>
                                <Typography fontSize={11}>{icon.label}</Typography>
                            </Button>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
