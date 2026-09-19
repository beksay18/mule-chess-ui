import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';

import type { Product } from 'src/api/product';

import type { StickerBuilderApi } from '../hooks/use-sticker-builder';
import { BRAND_BLUE } from '../constants';
import { LayersPanel } from './layers-panel';
import { LivePreview } from './live-preview';
import { PropertiesPanel } from './properties-panel';
import { SpecsPanel } from './specs-panel';

type RightTab = 'properties' | 'layers' | 'specs' | 'preview';

type RightSidebarProps = {
    api: StickerBuilderApi;
    previewUrl: string;
    products: Product[];
    product: Product | null;
    onProductChange: (product: Product) => void;
};

export function RightSidebar({ api, previewUrl, products, product, onProductChange }: RightSidebarProps) {
    const [tab, setTab] = useState<RightTab>('properties');

    return (
        <Box
            sx={{
                width: { md: 320 },
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                bgcolor: '#ffffff',
                minHeight: 0,
            }}
        >
            <Tabs
                value={tab}
                onChange={(_, value: RightTab) => setTab(value)}
                variant="fullWidth"
                sx={{
                    minHeight: 56,
                    borderBottom: `1px solid ${alpha('#0f172a', 0.06)}`,
                    '& .MuiTab-root': {
                        minHeight: 56,
                        textTransform: 'none',
                        fontSize: 12,
                        fontWeight: 700,
                    },
                }}
            >
                <Tab value="properties" label="Edit" />
                <Tab value="layers" label="Layers" />
                <Tab value="specs" label="Specs" />
                <Tab value="preview" label="Preview" />
            </Tabs>
            <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
                {tab === 'properties' && <PropertiesPanel api={api} />}
                {tab === 'layers' && <LayersPanel api={api} />}
                {tab === 'specs' && (
                    <SpecsPanel
                        api={api}
                        products={products}
                        product={product}
                        onProductChange={onProductChange}
                    />
                )}
                {tab === 'preview' && <LivePreview previewUrl={previewUrl} design={api.design} />}
            </Box>
        </Box>
    );
}
