import { useState } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import type { Product } from 'src/api/product';

import type { StickerBuilderApi } from '../hooks/use-sticker-builder';
import { LayersPanel } from './layers-panel';
import { LeftSidebar } from './left-sidebar';
import { LivePreview } from './live-preview';
import { PropertiesPanel } from './properties-panel';
import { SpecsPanel } from './specs-panel';

type MobileTab = 'add' | 'edit' | 'layers' | 'specs' | 'preview';

type MobileControlsProps = {
    api: StickerBuilderApi;
    previewUrl: string;
    products: Product[];
    product: Product | null;
    onProductChange: (product: Product) => void;
};

export function MobileControls({ api, previewUrl, products, product, onProductChange }: MobileControlsProps) {
    const [tab, setTab] = useState<MobileTab | null>(null);

    return (
        <>
            <Box
                sx={{
                    display: { xs: 'block', md: 'none' },
                    borderTop: '1px solid #e5e7eb',
                    bgcolor: '#ffffff',
                }}
            >
                <Tabs
                    value={false}
                    variant="fullWidth"
                    onChange={(_, value: MobileTab) => setTab(value)}
                    sx={{
                        minHeight: 56,
                        '& .MuiTab-root': { minHeight: 56, textTransform: 'none', fontWeight: 700, fontSize: 12 },
                    }}
                >
                    <Tab value="add" label="Add" />
                    <Tab value="edit" label="Edit" />
                    <Tab value="layers" label="Layers" />
                    <Tab value="specs" label="Specs" />
                    <Tab value="preview" label="Preview" />
                </Tabs>
            </Box>

            <Drawer
                anchor="bottom"
                open={Boolean(tab)}
                onClose={() => setTab(null)}
                PaperProps={{ sx: { height: '70vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
            >
                {tab === 'add' && <LeftSidebar api={api} />}
                {tab === 'edit' && (
                    <Box sx={{ p: 2 }}>
                        <PropertiesPanel api={api} />
                    </Box>
                )}
                {tab === 'layers' && (
                    <Box sx={{ p: 2 }}>
                        <LayersPanel api={api} />
                    </Box>
                )}
                {tab === 'specs' && (
                    <Box sx={{ p: 2 }}>
                        <SpecsPanel
                            api={api}
                            products={products}
                            product={product}
                            onProductChange={onProductChange}
                        />
                    </Box>
                )}
                {tab === 'preview' && (
                    <Box sx={{ p: 2 }}>
                        <LivePreview previewUrl={previewUrl} design={api.design} />
                    </Box>
                )}
            </Drawer>
        </>
    );
}
