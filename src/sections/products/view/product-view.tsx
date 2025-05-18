import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import Button from "@mui/material/Button";
import {Iconify} from "../../../components/iconify";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";
import { useRouter} from 'src/routes/hooks';
import { ProductItem, ProductItemProps } from '../product-item';
import {deleteProduct, getAllProducts, Product} from "../../../api/product";

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
        productType: product.productType.name,
        status: product.isActive ? 'active' : 'inactive',
        coverUrl: product.imageUrl || '',
        color: getRandomColor(),
        onEdit,
        onDelete,
    };
}


export function ProductView() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getAllProducts();
        console.log("Loaded products:", data);
        setProducts(data);
    };

    const handleEdit = (id: number) => {
        router.push(`/products/product-form/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                loadProducts();
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
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => router.push('product-form')}
                >
                    New Product
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

