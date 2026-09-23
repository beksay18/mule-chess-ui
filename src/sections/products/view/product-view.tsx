import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import {
    deleteProduct,
    getDisplayPrice,
    getProductByProductTypeId,
    Product,
    sortProductsByPosition,
} from '../../../api/product';
import { getProductTypeById } from '../../../api/productType';
import { ProductItem, ProductItemProps } from '../product-item';

const BRAND_BLUE = '#175195';

function mapToProductItem(
    product: Product,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
): ProductItemProps {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: getDisplayPrice(product),
        productType: product.productType.name || 'Unknown',
        status: product.isActive ? 'active' : 'inactive',
        coverUrl: product.imageUrl || '',
        position: product.position != null ? Number(product.position) : undefined,
        onEdit,
        onDelete,
    };
}

export function ProductView() {
    const theme = useTheme();
    const router = useRouter();
    const { typeId } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [productTypeName, setProductTypeName] = useState('Products');
    const [loading, setLoading] = useState(true);

    const activeCount = useMemo(
        () => products.filter((item) => item.isActive).length,
        [products]
    );

    useEffect(() => {
        if (typeId) {
            loadProductsByType(Number(typeId));
        }
    }, [typeId]);

    const loadProductsByType = async (id: number) => {
        setLoading(true);
        try {
            const [data, typeData] = await Promise.all([
                getProductByProductTypeId(id),
                getProductTypeById(id).catch(() => null),
            ]);

            const productsArray = Array.isArray(data) ? data : data ? [data] : [];
            setProducts(sortProductsByPosition(productsArray));

            if (typeData?.name) {
                setProductTypeName(typeData.name);
            } else if (productsArray[0]?.productType?.name) {
                setProductTypeName(productsArray[0].productType.name);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/products/${typeId}/product-form/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                if (typeId) {
                    loadProductsByType(Number(typeId));
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Stack spacing={3}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.push('/products-types')}
                        sx={{
                            mb: 2,
                            px: 0,
                            color: 'text.secondary',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'transparent', color: BRAND_BLUE },
                        }}
                    >
                        Back to product types
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', maxWidth: 520 }}>
                            Manage {productTypeName.toLowerCase()} shown in the shop. Edit pricing,
                            sizes, and images for each product.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => router.push(`/products/${typeId}/product-form`)}
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
                            New {productTypeName.toLowerCase()}
                        </Button>
                    </Box>
                </Box>

                {!loading && products.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                            label={`${products.length} ${products.length === 1 ? 'product' : 'products'}`}
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
                ) : products.length > 0 ? (
                    <Grid container spacing={3}>
                        {products.map((item) => (
                            <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                                <ProductItem product={mapToProductItem(item, handleEdit, handleDelete)} />
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
                        <Inventory2OutlinedIcon
                            sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.25), mb: 1.5 }}
                        />
                        <Typography sx={{ fontWeight: 700, color: theme.palette.grey[800], mb: 0.5 }}>
                            No products in {productTypeName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                            Add your first product to make it available in the storefront.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => router.push(`/products/${typeId}/product-form`)}
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
                            Add first product
                        </Button>
                    </Box>
                )}
            </Stack>
        </DashboardContent>
    );
}
