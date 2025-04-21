import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Card,
    TextField,
    Typography,
    Stack,
    Button, FormControlLabel, FormControl, InputLabel, Select,
} from '@mui/material';
import {Iconify} from 'src/components/iconify';
import {DashboardContent} from "../../layouts/dashboard";
import Checkbox from "@mui/material/Checkbox";
import {
    createProduct,
    getProductById,
    ProductDimensionRequest,
    ProductPricingRequest,
    updateProduct
} from "../../api/product";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {getAllProductTypes, ProductType} from "../../api/productType";
import MenuItem from "@mui/material/MenuItem";

export default function ProductForm() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [dimensions, setDimensions] = useState<ProductDimensionRequest[]>([
        { width: 0, height: 0, isCustom: false },
    ]);
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number | null>(null);

    const [pricings, setPricings] = useState<ProductPricingRequest[]>([
        { quantity: 1, basePrice: 0, discountPercent: 0 },
    ]);

    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getProductById(Number(id)).then((data) => {
                setName(data.name);
                setIsActive(data.isActive);
                setDescription(data.description)
            });
        }

        getAllProductTypes().then(setProductTypes);
    }, [id]);

    const handleSubmit = async () => {
        try {
            if (!selectedProductTypeId) {
                alert("Please select a product type");
                return;
            }
            const request = {
                name,
                description,
                isActive,
                productTypeId: selectedProductTypeId,
                dimensions,
                pricings,
            };

            if (id) {
                await updateProduct(Number(id), request);
            } else {
                await createProduct(request);
            }
            navigate('/products');
        } catch (error) {
            console.error('Failed to save product type:', error);
        }
    };

    const handleDimensionChange = <K extends keyof ProductDimensionRequest>(
        index: number,
        field: K,
        value: ProductDimensionRequest[K]
    ) => {
        const updated = [...dimensions];
        updated[index][field] = value;
        setDimensions(updated);
    };

    const addDimension = () => {
        setDimensions([...dimensions, { width: 0, height: 0, isCustom: false }]);
    };

    const removeDimension = (index: number) => {
        const updated = [...dimensions];
        updated.splice(index, 1);
        setDimensions(updated);
    };

    return (
        <DashboardContent>
            <Box>
                <Typography variant="h4" sx={{mb: 3}}>
                    Product Form
                </Typography>

                <Card sx={{p: 3}}>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel id="product-type-label">Product Type</InputLabel>
                            <Select
                                labelId="product-type-label"
                                value={selectedProductTypeId ?? ''}
                                onChange={(e) => setSelectedProductTypeId(Number(e.target.value))}
                                label="Product Type"
                            >
                                {productTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            label="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                            }
                            label="Active"
                        />

                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Dimensions
                        </Typography>

                        {dimensions.map((dim, index) => (
                            <Stack direction="row" spacing={2} key={index}>
                                <TextField
                                    label="Width"
                                    type="number"
                                    value={dim.width}
                                    onChange={(e) =>
                                        handleDimensionChange(index, 'width', parseFloat(e.target.value))
                                    }
                                />
                                <TextField
                                    label="Height"
                                    type="number"
                                    value={dim.height}
                                    onChange={(e) =>
                                        handleDimensionChange(index, 'height', parseFloat(e.target.value))
                                    }
                                />
                                <IconButton onClick={() => removeDimension(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        ))}

                        <Button
                            variant="outlined"
                            onClick={addDimension}
                            sx={{ width: 'fit-content' }}
                        >
                            Add Dimension
                        </Button>

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="mingcute:add-line" />}
                                onClick={handleSubmit}
                                disabled={!name.trim()}
                            >
                                {id ? 'Update' : 'Create'}
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Box>
        </DashboardContent>
    );
}
