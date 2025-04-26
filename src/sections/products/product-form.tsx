import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Card,
    TextField,
    Typography,
    Stack,
    Button,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    IconButton, SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from '../../layouts/dashboard';
import {
    createProduct,
    getProductById,
    ProductDimensionRequest, ProductDiscountRequest,
    ProductRequest,
    updateProduct,
} from '../../api/product';
import { getAllProductTypes, ProductType } from '../../api/productType';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProductRequest>({
        name: '',
        description: '',
        price: null,
        isActive: true,
        productTypeId: null,
        dimensions: [],
        discounts: [],
    });
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProductTypes();
        if (id) loadProduct(Number(id));
    }, [id]);

    const loadProductTypes = async () => {
        const types = await getAllProductTypes();
        setProductTypes(types);
    };

    const loadProduct = async (productId: number) => {
        const data = await getProductById(productId);
        setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            isActive: data.isActive,
            productTypeId: data.productType.id,
            dimensions: data.dimensions || [],
            discounts: data.discounts || [],
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name!]: value }));
    };

    const handleNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name!]: value === '' ? null : parseFloat(value),
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name!]: Number(value),
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleDimensionChange = <K extends keyof ProductDimensionRequest>(
        index: number,
        field: K,
        value: ProductDimensionRequest[K]
    ) => {
        const updated = [...formData.dimensions];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, dimensions: updated }));
    };

    const addDimension = () => {
        setFormData((prev) => ({
            ...prev,
            dimensions: [...prev.dimensions, { width: 0, height: 0}],
        }));
    };

    const removeDimension = (index: number) => {
        const updated = [...formData.dimensions];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, dimensions: updated }));
    };

    const handleDiscountChange = <K extends keyof ProductDiscountRequest>(
        index: number,
        field: K,
        value: ProductDiscountRequest[K]
    ) => {
        const updated = [...formData.discounts];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, discounts: updated }));
    };

    const addDiscount = () => {
        setFormData((prev) => ({
            ...prev,
            discounts: [...prev.discounts, { quantity: 0, percentage: 0 }],
        }));
    };

    const removeDiscount = (index: number) => {
        const updated = [...formData.discounts];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, discounts: updated }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const filteredDimensions = formData.dimensions.filter(
                (dim) => dim.width > 0 && dim.height > 0
            );

            const filteredDiscounts = formData.discounts.filter(
                (discount) => discount.quantity > 0 && discount.percentage > 0
            );

            const updatedFormData = { ...formData, dimensions: filteredDimensions, discounts: filteredDiscounts };

            if (id) {
                await updateProduct(Number(id), updatedFormData);
            } else {
                await createProduct(formData);
            }
            navigate('/products');
        } catch (err) {
            console.error('Failed to submit', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContent>
            <Box>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    {id ? 'Edit Product' : 'Create Product'}
                </Typography>

                <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel id="product-type-label">Product Type</InputLabel>
                            <Select
                                labelId="product-type-label"
                                name="productTypeId"
                                value={formData.productTypeId ?? ''}
                                label="Product Type"
                                onChange={(e) => handleSelectChange(e)}
                            >
                                <MenuItem value="" disabled>Select a Product Type</MenuItem>
                                {productTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Product Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                        />

                        <TextField
                            label="Product Price"
                            name="price"
                            type="number"
                            value={formData.price ?? ''}
                            onChange={handleNumberChange}
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label="Active"
                        />
                        {formData.dimensions.length > 0 && (
                            <>
                        <Typography variant="h6">Dimensions</Typography>

                        {formData.dimensions.map((dim, index) => (
                            <Stack direction="row" spacing={2} alignItems="center" key={index}>
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
                            </>
                        )}

                        <Button variant="outlined" onClick={addDimension} sx={{ width: 'fit-content' }}>
                            Add Dimension
                        </Button>

                        {formData.discounts.length > 0 && (
                            <>
                                <Typography variant="h6">Discounts</Typography>

                                {formData.discounts.map((discount, index) => (
                                    <Stack direction="row" spacing={2} alignItems="center" key={index}>
                                        <TextField
                                            label="Quantity"
                                            type="number"
                                            value={discount.quantity}
                                            onChange={(e) =>
                                                handleDiscountChange(index, 'quantity', parseFloat(e.target.value))
                                            }
                                        />
                                        <TextField
                                            label="Discount %"
                                            type="number"
                                            value={discount.percentage}
                                            onChange={(e) =>
                                                handleDiscountChange(index, 'percentage', parseFloat(e.target.value))
                                            }
                                        />
                                        <IconButton onClick={() => removeDiscount(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </>
                        )}

                        <Button variant="outlined" onClick={addDiscount} sx={{ width: 'fit-content' }}>
                            Add Discount
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
                                disabled={!formData.name.trim()}
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
