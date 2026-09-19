import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { type Product, getProductById, getActiveProducts } from 'src/api/product';
import { getActiveProductTypes } from 'src/api/productType';
import { useRouter } from 'src/routes/hooks';

import { useCart } from '../../home/create-order/cart/cart-context';
import { BRAND_BLUE, BRAND_GREEN } from '../constants';
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts';
import { useStickerBuilder } from '../hooks/use-sticker-builder';
import { exportDesignJson } from '../renderer';
import { getSizeLabel } from '../utils';
import { AddToCartDialog } from '../components/add-to-cart-dialog';
import { BuilderToolbar } from '../components/builder-toolbar';
import { LeftSidebar } from '../components/left-sidebar';
import { MobileControls } from '../components/mobile-controls';
import { RightSidebar } from '../components/right-sidebar';
import { SavedDesignsDialog } from '../components/saved-designs-dialog';
import { StickerCanvas } from '../components/sticker-canvas';

export function StickerBuilderView() {
    const router = useRouter();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const designId = searchParams.get('design');
    const { addItem } = useCart();

    const api = useStickerBuilder(designId || undefined);
    useKeyboardShortcuts(api);

    const [product, setProduct] = useState<Product | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [cartOpen, setCartOpen] = useState(false);
    const [designsOpen, setDesignsOpen] = useState(searchParams.get('panel') === 'designs');
    const [snack, setSnack] = useState('');
    const [previewError, setPreviewError] = useState('');

    useEffect(() => {
        const href =
            'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Oswald:wght@400;600&family=Pacifico&family=Permanent+Marker&display=swap';
        const existing = document.querySelector(`link[href="${href}"]`);
        if (existing) return undefined;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        return undefined;
    }, []);

    useEffect(() => {
        let active = true;
        const loadProduct = async () => {
            try {
                if (productId) {
                    const found = await getProductById(Number(productId));
                    if (active) setProduct(found);
                    return;
                }
                const types = await getActiveProductTypes();
                const firstType = types[0];
                if (!firstType) return;
                const products = await getActiveProducts(firstType.id);
                if (active && products[0]) setProduct(products[0]);
            } catch {
                if (active) setProduct(null);
            }
        };
        void loadProduct();
        return () => {
            active = false;
        };
    }, [productId]);

    const { design, generatePreview } = api;

    useEffect(() => {
        let cancelled = false;
        const timer = window.setTimeout(() => {
            generatePreview(false)
                .then((url) => {
                    if (!cancelled) {
                        setPreviewUrl(url);
                        setPreviewError('');
                    }
                })
                .catch(() => {
                    if (!cancelled) setPreviewError('Preview could not be generated.');
                });
        }, 280);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [design, generatePreview]);

    const handleSave = async () => {
        await api.persistDesign();
        setSnack('Design saved. You can reopen it anytime from Designs.');
    };

    const handleAddToCart = async () => {
        const preview = previewUrl || (await api.generatePreview(true));
        if (!api.validation.valid) {
            setCartOpen(true);
            return;
        }
        setPreviewUrl(preview);
        setCartOpen(true);
    };

    const confirmAddToCart = async () => {
        if (!api.validation.valid) return;
        const preview = previewUrl || (await api.generatePreview(true));
        await api.persistDesign();
        addItem({
            productId: product?.id || 0,
            name: api.design.name || product?.name || 'Custom sticker',
            price: api.price.unitPrice,
            width: api.price.sizeInches.width,
            height: api.price.sizeInches.height,
            quantity: api.price.quantity,
            percentage: api.price.discountPercent,
            customDimension: api.design.sticker.size === 'custom',
            lamination: api.design.sticker.finish === 'glossy' ? 'gloss' : 'matte',
            previewUrl: preview,
            material: api.design.sticker.material,
            finish: api.design.sticker.finish,
            cutType: api.design.sticker.shape,
            designId: api.design.id,
            designJson: exportDesignJson(api.design),
        });
        setCartOpen(false);
        router.push('/cart');
    };

    const issue = api.validation.issues[0];

    return (
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 0.75,
                    bgcolor: '#ffffff',
                    borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                }}
            >
                <Button href="/" sx={{ textTransform: 'none', fontWeight: 700, color: BRAND_BLUE }}>
                    Back to shop
                </Button>
                <Typography fontWeight={800}>Sticker Builder</Typography>
                <Button href="/cart" sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                    Cart
                </Button>
            </Box>

            <BuilderToolbar
                api={api}
                onOpenDesigns={() => setDesignsOpen(true)}
                onSave={() => void handleSave()}
            />

            <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <LeftSidebar api={api} />
                </Box>
                <StickerCanvas api={api} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <RightSidebar api={api} previewUrl={previewUrl} />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    px: { xs: 1.5, md: 2.5 },
                    py: 1.25,
                    bgcolor: '#ffffff',
                    borderTop: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={800} sx={{ fontSize: { xs: 16, md: 20 } }}>
                        ${api.price.total.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                        {getSizeLabel(api.design.sticker)} · {api.design.sticker.quantity} · {api.design.sticker.material}{' '}
                        · {api.design.sticker.finish}
                    </Typography>
                    {issue && (
                        <Typography variant="caption" color="warning.main" display="block">
                            {issue.message}
                        </Typography>
                    )}
                    {previewError && (
                        <Typography variant="caption" color="error.main" display="block">
                            {previewError}
                        </Typography>
                    )}
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartOutlinedIcon />}
                    onClick={() => void handleAddToCart()}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 800,
                        px: { xs: 2, md: 3.5 },
                        bgcolor: BRAND_BLUE,
                        '&:hover': { bgcolor: BRAND_GREEN },
                    }}
                >
                    Add to Cart
                </Button>
            </Box>

            <MobileControls api={api} previewUrl={previewUrl} />

            <AddToCartDialog
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                onConfirm={() => void confirmAddToCart()}
                design={api.design}
                previewUrl={previewUrl}
                price={api.price}
                validation={api.validation}
            />
            <SavedDesignsDialog open={designsOpen} onClose={() => setDesignsOpen(false)} api={api} />
            <Snackbar
                open={Boolean(snack)}
                autoHideDuration={2400}
                onClose={() => setSnack('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setSnack('')}>
                    {snack}
                </Alert>
            </Snackbar>
        </Box>
    );
}
