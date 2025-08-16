import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import Button from "@mui/material/Button";
import {Iconify} from "../../../components/iconify";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import { useRouter} from 'src/routes/hooks';
import { ProductItem, ProductItemProps } from '../product-item';
import {deleteProduct, getProductByProductTypeId, Product} from "../../../api/product";
import {useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ----------------------------------------------------------------------


function getRandomColor(): string {
    const colors = ['#FFC107', '#8BC34A', '#03A9F4', '#E91E63', '#FF5722', '#9C27B0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function mapToProductItem(
    product: Product,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void
): ProductItemProps {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        productType: product.productType.name || 'Unknown',
        status: product.isActive ? 'active' : 'inactive',
        coverUrl: product.imageUrl || '',
        color: getRandomColor(),
        onEdit,
        onDelete,
    };
}


export function ProductView() {
    const router = useRouter();
    const { typeId } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [productTypeName, setProductTypeName] = useState<string>('Product');

    useEffect(() => {
        if (typeId) {
            loadProductsByType(Number(typeId));
        }
    }, [typeId]);

    const loadProductsByType = async (id: number) => {
        try {
            const data = await getProductByProductTypeId(id);
            const productsArray = Array.isArray(data) ? data : data ? [data] : [];
            setProducts(productsArray);

            if (productsArray.length > 0 && productsArray[0].productType?.name) {
                setProductTypeName(productsArray[0].productType.name);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
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
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={() => router.back()}
                    variant="outlined"
                    sx={{textTransform: 'none', mr: 2}}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => router.push('product-form')}
                >
                    New {productTypeName}
                </Button>
            </Box>

            <Grid container>
                {products.map((item) => (
                    <Grid key={item.id} size={{ xs: 12}}>
                        <ProductItem product={mapToProductItem(item, handleEdit, handleDelete)} />
                    </Grid>
                ))}
            </Grid>
        </DashboardContent>
    );
}

