import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import { deleteProductType, getAllProductTypes, ProductType } from '../../../api/productType';
import { ProductItemProps, ProductTypeItem } from '../product-type-item';

const BRAND_BLUE = '#175195';

function mapToProductTypeItem(
    productType: ProductType,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
): ProductItemProps {
    return {
        id: productType.id,
        name: productType.name,
        status: productType.isActive ? 'active' : 'inactive',
        coverUrl: productType.imageUrl || '',
        position: productType.position != null ? Number(productType.position) : undefined,
        onEdit,
        onDelete,
    };
}

export function ProductTypesView() {
    const theme = useTheme();
    const router = useRouter();
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    const activeCount = useMemo(
        () => productTypes.filter((item) => item.isActive).length,
        [productTypes]
    );

    useEffect(() => {
        loadProductTypes();
    }, []);

    const loadProductTypes = async () => {
        setLoading(true);
        try {
            const data = await getAllProductTypes();
            setProductTypes(
                [...data].sort((a, b) => {
                    const posA = a.position ?? Number.MAX_SAFE_INTEGER;
                    const posB = b.position ?? Number.MAX_SAFE_INTEGER;
                    return posA - posB;
                })
            );
        } catch (err) {
            console.error('Failed to load product types', err);
            setProductTypes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/products-types/product-types-form/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product type?')) {
            try {
                await deleteProductType(id);
                loadProductTypes();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Stack spacing={3}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'flex-end',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/products-types/product-types-form')}
                        sx={{
                            flexShrink: 0,
                            px: 2.5,
                            py: 1,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            borderRadius: 50,
                            bgcolor: BRAND_BLUE,
                            textTransform: 'none',
                            boxShadow: `0 4px 16px ${alpha(BRAND_BLUE, 0.25)}`,
                            '&:hover': { bgcolor: '#124578' },
                        }}
                    >
                        New product type
                    </Button>
                </Box>

                {!loading && productTypes.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                            label={`${productTypes.length} ${productTypes.length === 1 ? 'type' : 'types'}`}
                            sx={{
                                fontWeight: 600,
                                bgcolor: alpha(BRAND_BLUE, 0.08),
                                color: BRAND_BLUE,
                            }}
                        />
                        <Chip
                            label={`${activeCount} active`}
                            sx={{
                                fontWeight: 600,
                                bgcolor: alpha('#4caf50', 0.1),
                                color: '#2e7d32',
                            }}
                        />
                    </Stack>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: BRAND_BLUE }} />
                    </Box>
                ) : productTypes.length > 0 ? (
                    <Grid container spacing={3}>
                        {productTypes.map((item) => (
                            <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                                <ProductTypeItem
                                    product={mapToProductTypeItem(item, handleEdit, handleDelete)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            py: 10,
                            textAlign: 'center',
                            borderRadius: 3,
                            border: `1px dashed ${alpha(BRAND_BLUE, 0.2)}`,
                            bgcolor: alpha(BRAND_BLUE, 0.02),
                        }}
                    >
                        <CategoryOutlinedIcon
                            sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.25), mb: 1.5 }}
                        />
                        <Typography sx={{ fontWeight: 700, color: theme.palette.grey[800], mb: 0.5 }}>
                            No product types yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                            Create a sticker category to start adding products.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/products-types/product-types-form')}
                            sx={{
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 50,
                                color: BRAND_BLUE,
                                borderColor: alpha(BRAND_BLUE, 0.35),
                                '&:hover': {
                                    borderColor: BRAND_BLUE,
                                    bgcolor: alpha(BRAND_BLUE, 0.04),
                                },
                            }}
                        >
                            Create first type
                        </Button>
                    </Box>
                )}
            </Stack>
        </DashboardContent>
    );
}
