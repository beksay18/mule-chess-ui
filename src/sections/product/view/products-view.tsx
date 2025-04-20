import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import Button from "@mui/material/Button";
import {Iconify} from "../../../components/iconify";
import Box from "@mui/material/Box";
import {getAllProductTypes, ProductType} from "../../../api/productType";
import {useEffect, useState} from "react";
import { useRouter} from 'src/routes/hooks';
import { ProductItem, ProductItemProps } from '../product-item';

// ----------------------------------------------------------------------


function getRandomColor(): string {
    const colors = ['#FFC107', '#8BC34A', '#03A9F4', '#E91E63', '#FF5722', '#9C27B0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function mapToProductItem(productType: ProductType): ProductItemProps {
    return {
        name: productType.name,
        status: productType.isActive ? 'active' : 'inactive',
        coverUrl: '',
        color: getRandomColor(),
    };
}

export function ProductsView() {
    const router = useRouter();
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllProductTypes();
                setProductTypes(data);
            } catch (error) {
                console.error('Failed to load product types:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <DashboardContent maxWidth="xl">
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Product Types
                </Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => router.push('product-types-form')}
                >
                    New Product Type
                </Button>
            </Box>

            <Grid container spacing={3}>
                {productTypes.map((item) => (
                    <Grid key={item.id} size={{ xs: 12, sm: 6, md: 2 }}>
                        <ProductItem product={mapToProductItem(item)} />
                    </Grid>
                ))}
            </Grid>
        </DashboardContent>
    );
}

