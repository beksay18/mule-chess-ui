import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
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
import {Iconify} from 'src/components/iconify';
import {DashboardContent} from '../../layouts/dashboard';
import {
    createProduct,
    getProductById,
    ProductDimensionRequest, ProductDiscountRequest,
    ProductRequest,
    updateProduct,
} from '../../api/product';
import {getAllProductTypes, ProductType} from '../../api/productType';

export default function ProductForm() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const [formData, setFormData] = useState<ProductRequest>({
        name: '',
        description: '',
        price: null,
        isActive: true,
        productTypeId: null,
        dimensions: [],
        discounts: [],
        maxHeight: 0,
        maxWidth: 0,
        maxQuantity: 0,
    });
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [backgroundImage, setBackgroundImage] = useState<File | undefined>(undefined);
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

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
            maxHeight: data.maxHeight,
            maxWidth: data.maxWidth,
            maxQuantity: data.maxQuantity,
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name!]: value}));
    };

    const handleNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name!]: value === '' ? null : parseFloat(value),
        }));
    };

    const handleWholeNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        const intValue = parseInt(value, 10);
        const isValid = /^\d+$/.test(value) && intValue > 0;

        setFormData((prev) => ({
            ...prev,
            [name!]: value === '' ? null : intValue,
        }));

        setFieldErrors((prev) => ({
            ...prev,
            [name!]: !isValid,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name!]: Number(value),
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setFormData((prev) => ({...prev, [name]: checked}));
    };

    const handleDimensionChange = <K extends keyof ProductDimensionRequest>(
        index: number,
        field: K,
        value: ProductDimensionRequest[K]
    ) => {
        const updated = [...formData.dimensions];
        updated[index][field] = value;
        setFormData((prev) => ({...prev, dimensions: updated}));
    };

    const addDimension = () => {
        setFormData((prev) => ({
            ...prev,
            dimensions: [...prev.dimensions, {width: 0, height: 0}],
        }));
    };

    const removeDimension = (index: number) => {
        const updated = [...formData.dimensions];
        updated.splice(index, 1);
        setFormData((prev) => ({...prev, dimensions: updated}));
    };

    const handleDiscountChange = <K extends keyof ProductDiscountRequest>(
        index: number,
        field: K,
        value: ProductDiscountRequest[K]
    ) => {
        const updated = [...formData.discounts];
        updated[index][field] = value;
        setFormData((prev) => ({...prev, discounts: updated}));
    };

    const addDiscount = () => {
        setFormData((prev) => ({
            ...prev,
            discounts: [...prev.discounts, {quantity: 1, percentage: 0}],
        }));
    };

    const removeDiscount = (index: number) => {
        const updated = [...formData.discounts];
        updated.splice(index, 1);
        setFormData((prev) => ({...prev, discounts: updated}));
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            formData.price === null ||
            formData.productTypeId === null ||
            formData.maxHeight === null || formData.maxHeight <= 0 ||
            formData.maxWidth === null || formData.maxWidth <= 0 ||
            formData.maxQuantity === null || formData.maxQuantity <= 0
        ) {
            return;
        }

        setLoading(true);
        try {
            const filteredDimensions = formData.dimensions.filter(
                (dim) => dim.width > 0 && dim.height > 0
            );

            const filteredDiscounts = formData.discounts.filter(
                (discount) => discount.quantity > 0
            );

            const updatedFormData = {...formData, dimensions: filteredDimensions, discounts: filteredDiscounts};

            if (id) {
                await updateProduct(Number(id), {...updatedFormData, image, backgroundImage});
            } else {
                await createProduct({...updatedFormData, image, backgroundImage});
            }
            navigate('/products');
        } catch (err) {
            console.error('Failed to submit', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Stack>
                <Typography variant="h4" sx={{mb: 3}}>
                    {id ? 'Edit Product' : 'Create Product'}
                </Typography>

                <Card sx={{p: 3}}>
                    <Stack spacing={3}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
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
                                {submitAttempted && !formData.productTypeId && (
                                    <Typography variant="caption" color="error">Product type is required</Typography>
                                )}
                            </FormControl>

                            <TextField
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={submitAttempted && !formData.name.trim()}
                                helperText={submitAttempted && !formData.name.trim() ? 'Product Name is required' : ''}
                            />
                        </Box>

                        <TextField
                            label="Product Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            required
                            error={submitAttempted && !formData.description.trim()}
                            helperText={submitAttempted && !formData.description.trim() ? 'Product Description is required' : ''}
                        />

                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <TextField
                            label="Product Price"
                            name="price"
                            type="number"
                            value={formData.price ?? ''}
                            onChange={handleNumberChange}
                            fullWidth
                            required
                            error={submitAttempted && (formData.price === null || formData.price <= 0)}
                            helperText={
                                submitAttempted && (formData.price === null || formData.price <= 0)
                                    ? 'Price must be greater than 0'
                                    : ''
                            }
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
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <TextField
                                label="Maximum Height"
                                name="maxHeight"
                                type="number"
                                value={formData.maxHeight ?? ''}
                                onChange={handleWholeNumberChange}
                                fullWidth
                                required
                                error={fieldErrors.maxHeight || (submitAttempted && (!formData.maxHeight || formData.maxHeight <= 0))}
                                helperText={
                                    fieldErrors.maxHeight
                                        ? 'Please enter a valid whole number greater than 0'
                                        : submitAttempted && (!formData.maxHeight || formData.maxHeight <= 0)
                                            ? 'Maximum Height must be greater than 0'
                                            : ''
                                }
                            />

                            <TextField
                                label="Maximum Width"
                                name="maxWidth"
                                type="number"
                                value={formData.maxWidth ?? ''}
                                onChange={handleWholeNumberChange}
                                fullWidth
                                required
                                error={fieldErrors.maxWidth || (submitAttempted && (!formData.maxWidth || formData.maxWidth <= 0))}
                                helperText={
                                    fieldErrors.maxWidth
                                        ? 'Please enter a valid whole number greater than 0'
                                        : submitAttempted && (!formData.maxWidth || formData.maxWidth <= 0)
                                            ? 'Maximum Height must be greater than 0'
                                            : ''
                                }
                            />

                            <TextField
                                label="Maximum Quantity"
                                name="maxQuantity"
                                type="number"
                                value={formData.maxQuantity ?? ''}
                                onChange={handleWholeNumberChange}
                                fullWidth
                                required
                                error={fieldErrors.maxQuantity || (submitAttempted && (!formData.maxQuantity || formData.maxQuantity <= 0))}
                                helperText={
                                    fieldErrors.maxQuantity
                                        ? 'Please enter a valid whole number greater than 0'
                                        : submitAttempted && (!formData.maxQuantity || formData.maxQuantity <= 0)
                                            ? 'Maximum Height must be greater than 0'
                                            : ''
                                }
                            />

                        </Box>

                        <Typography variant="h6">Images</Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Button variant="outlined" component="label">
                                    Upload Image
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </Button>
                                <Typography variant="body2">
                                    {image?.name ?? 'No file selected'}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Button variant="outlined" component="label">
                                    Upload Background Image
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setBackgroundImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </Button>
                                <Typography variant="body2">
                                    {backgroundImage?.name ?? 'No file selected'}
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack
                            direction={{xs: 'column', md: 'row'}}
                            spacing={2}
                            alignItems="flex-start"
                        >
                            <Box flex={1}>
                                {formData.dimensions.length > 0 && (
                                    <>
                                        <Typography sx={{mb: 2}} variant="h6">Dimensions</Typography>

                                        {formData.dimensions.map((dim, index) => (
                                            <Box key={index} sx={{mb: 2}}>
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
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </>
                                )}

                                <Button variant="outlined" onClick={addDimension} sx={{width: 'fit-content'}}>
                                    Add Dimension
                                </Button>
                            </Box>
                            <Box flex={1}>
                                {formData.discounts.length > 0 && (
                                    <>
                                        <Typography sx={{mb: 2}} variant="h6">Discounts</Typography>

                                        {formData.discounts.map((discount, index) => (
                                            <Box key={index} sx={{mb: 2}}>
                                                <Stack direction="row" spacing={2} alignItems="center" key={index}>
                                                    <TextField
                                                        label="Quantity"
                                                        type="number"
                                                        value={discount.quantity}
                                                        error={discount.quantity === 0}
                                                        helperText={discount.quantity === 0 ? 'Quantity should not be zero' : ''}
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
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </>
                                )}

                                <Button variant="outlined" onClick={addDiscount} sx={{width: 'fit-content'}}>
                                    Add Discount
                                </Button>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<ArrowBackIcon/>}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!formData.name.trim()}
                            >
                                {id ? 'Update' : 'Create'}
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
        </DashboardContent>
    );
}
