import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { DashboardContent } from '../../layouts/dashboard';
import {
    createProduct,
    getFallbackPriceFromMaterials,
    getProductById,
    ProductDimensionRequest,
    ProductDiscountRequest,
    ProductMaterialRequest,
    ProductRequest,
    sortDiscountsByQuantity,
    updateProduct,
} from '../../api/product';

const BRAND_BLUE = '#175195';

const MATERIAL_PRICE_FIELDS = [
    { id: 'vinyl', label: 'Vinyl' },
    { id: 'paper', label: 'Paper' },
    { id: 'holographic', label: 'Holographic' },
    { id: 'clear', label: 'Clear' },
] as const;

function emptyMaterials(): ProductMaterialRequest[] {
    return MATERIAL_PRICE_FIELDS.map((item) => ({ material: item.id, price: 0 }));
}

function mergeMaterials(materials?: ProductMaterialRequest[]): ProductMaterialRequest[] {
    return MATERIAL_PRICE_FIELDS.map((item) => ({
        material: item.id,
        price: Number(materials?.find((row) => row.material === item.id)?.price) || 0,
    }));
}

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(BRAND_BLUE, 0.4),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND_BLUE,
        },
    },
};

const sectionSx = {
    p: 2.5,
    borderRadius: 2.5,
    border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
    bgcolor: alpha(BRAND_BLUE, 0.02),
};

type RouteParams = { id?: string; productTypeId?: string; typeId?: string };

function useImagePreview(file: File | undefined) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        let previewUrl: string | null = null;

        if (file) {
            previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        } else {
            setPreview(null);
        }

        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file]);

    return preview;
}

type ImageUploadPanelProps = {
    title: string;
    helperText: string;
    displayUrl: string | null;
    selectedFile?: File;
    onFileChange: (file: File) => void;
    onClearSelected: () => void;
};

function ImageUploadPanel({
    title,
    helperText,
    displayUrl,
    selectedFile,
    onFileChange,
    onClearSelected,
}: ImageUploadPanelProps) {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: theme.palette.grey[800],
                    mb: 1.5,
                }}
            >
                {title}
            </Typography>

            {displayUrl ? (
                <Box
                    sx={{
                        position: 'relative',
                        mb: 2,
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: alpha(BRAND_BLUE, 0.04),
                        border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 160,
                    }}
                >
                    <Box
                        component="img"
                        src={displayUrl}
                        alt={title}
                        sx={{
                            maxWidth: '100%',
                            maxHeight: 180,
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                    {selectedFile && (
                        <IconButton
                            size="small"
                            aria-label={`Remove selected ${title}`}
                            onClick={onClearSelected}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: '#ffffff',
                                boxShadow: 1,
                                '&:hover': { bgcolor: theme.palette.grey[100] },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            ) : null}

            <Box
                component="label"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    p: 2.5,
                    minHeight: displayUrl ? 100 : 160,
                    borderRadius: 2.5,
                    border: `2px dashed ${alpha(BRAND_BLUE, 0.25)}`,
                    bgcolor: alpha(BRAND_BLUE, 0.02),
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                        borderColor: alpha(BRAND_BLUE, 0.45),
                        bgcolor: alpha(BRAND_BLUE, 0.04),
                    },
                }}
            >
                <CloudUploadOutlinedIcon sx={{ fontSize: 28, color: alpha(BRAND_BLUE, 0.55) }} />
                <Typography sx={{ fontWeight: 600, color: BRAND_BLUE, fontSize: '0.875rem' }}>
                    {displayUrl ? 'Replace image' : 'Upload image'}
                </Typography>
                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            onFileChange(file);
                        }
                    }}
                />
            </Box>

            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                {selectedFile
                    ? `New file selected: ${selectedFile.name}`
                    : helperText}
            </Typography>
        </Box>
    );
}

export default function ProductForm() {
    const theme = useTheme();
    const params = useParams<RouteParams>();
    const navigate = useNavigate();
    const isEdit = Boolean(params.id);
    const routeProductTypeIdStr = params.productTypeId ?? params.typeId ?? null;
    const routeProductTypeId = routeProductTypeIdStr ? Number(routeProductTypeIdStr) : null;

    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<ProductRequest>({
        name: '',
        description: '',
        price: null,
        isActive: true,
        productTypeId: routeProductTypeId,
        dimensions: [],
        discounts: [],
        materials: emptyMaterials(),
        maxHeight: 0,
        maxWidth: 0,
        maxQuantity: 0,
        position: null,
    });
    const [image, setImage] = useState<File | undefined>(undefined);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';
    const imagePreview = useImagePreview(image);

    const displayImageUrl = useMemo(() => {
        if (imagePreview) return imagePreview;
        if (existingImageUrl) return `${baseURL}${existingImageUrl}`;
        return null;
    }, [imagePreview, existingImageUrl, baseURL]);

    useEffect(() => {
        if (params.id) {
            loadProduct(Number(params.id));
        }
    }, [params.id]);

    const loadProduct = async (productId: number) => {
        setPageLoading(true);
        try {
            const data = await getProductById(productId);
            setFormData({
                name: data.name,
                description: data.description,
                price: null,
                isActive: data.isActive,
                productTypeId: routeProductTypeId,
                dimensions: data.dimensions || [],
                discounts: sortDiscountsByQuantity(data.discounts || []),
                materials: mergeMaterials(data.materials),
                maxHeight: data.maxHeight,
                maxWidth: data.maxWidth,
                maxQuantity: data.maxQuantity,
                position: data.position ?? null,
            });
            setExistingImageUrl(data.imageUrl ?? null);
        } catch (error) {
            console.error('Failed to load product:', error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name!]: value }));
    };

    const handleWholeNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            dimensions: [...prev.dimensions, { width: 0, height: 0 }],
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
        setFormData((prev) => {
            const updated = [...prev.discounts];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, discounts: updated };
        });
    };

    const sortDiscountRows = () => {
        setFormData((prev) => ({
            ...prev,
            discounts: sortDiscountsByQuantity(prev.discounts),
        }));
    };

    const addDiscount = () => {
        setFormData((prev) => ({
            ...prev,
            discounts: [...prev.discounts, { quantity: 1, percentage: 0 }],
        }));
    };

    const removeDiscount = (index: number) => {
        const updated = [...formData.discounts];
        updated.splice(index, 1);
        setFormData((prev) => ({ ...prev, discounts: updated }));
    };

    const handleMaterialPriceChange = (material: string, value: string) => {
        const nextPrice = value === '' ? 0 : parseFloat(value);
        setFormData((prev) => ({
            ...prev,
            materials: mergeMaterials(prev.materials).map((row) =>
                row.material === material ? { ...row, price: Number.isFinite(nextPrice) ? nextPrice : 0 } : row
            ),
        }));
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            formData.maxHeight === null ||
            formData.maxHeight <= 0 ||
            formData.maxWidth === null ||
            formData.maxWidth <= 0 ||
            formData.maxQuantity === null ||
            formData.maxQuantity <= 0
        ) {
            return;
        }

        setSaving(true);
        try {
            const filteredDimensions = formData.dimensions.filter(
                (dim) => dim.width > 0 && dim.height > 0
            );
            const filteredDiscounts = sortDiscountsByQuantity(
                formData.discounts.filter((discount) => discount.quantity > 0)
            );
            const filteredMaterials = mergeMaterials(formData.materials).filter(
                (row) => row.price > 0
            );
            const payload = {
                ...formData,
                price: getFallbackPriceFromMaterials(filteredMaterials),
                dimensions: filteredDimensions,
                discounts: filteredDiscounts,
                materials: filteredMaterials,
                position:
                    formData.position === null || formData.position === undefined
                        ? undefined
                        : Number(formData.position),
            };

            if (params.id) {
                await updateProduct(Number(params.id), { ...payload, image });
            } else {
                await createProduct({ ...payload, image });
            }
            navigate(`/products/${formData.productTypeId}`);
        } catch (err) {
            console.error('Failed to submit', err);
        } finally {
            setSaving(false);
        }
    };

    if (pageLoading) {
        return (
            <DashboardContent maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress sx={{ color: BRAND_BLUE }} />
                </Box>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent maxWidth="lg">
            <Stack spacing={3}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/products/${formData.productTypeId}`)}
                        sx={{
                            mb: 2,
                            px: 0,
                            color: 'text.secondary',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'transparent', color: BRAND_BLUE },
                        }}
                    >
                        Back to products
                    </Button>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                        {isEdit
                            ? 'Update product details, sizing limits, and storefront image.'
                            : 'Create a new sticker product for this category.'}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        bgcolor: '#ffffff',
                        border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                        boxShadow: `0 4px 24px ${alpha(BRAND_BLUE, 0.06)}`,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: { xs: 3, md: 4 },
                            alignItems: { md: 'flex-start' },
                        }}
                    >
                        <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
                            <ImageUploadPanel
                                title="Product image"
                                helperText={
                                    existingImageUrl
                                        ? 'Current image shown above. Upload a new file to replace it.'
                                        : 'Shown on product cards in the shop.'
                                }
                                displayUrl={displayImageUrl}
                                selectedFile={image}
                                onFileChange={setImage}
                                onClearSelected={() => setImage(undefined)}
                            />
                        </Box>

                        <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                                label="Product name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={submitAttempted && !formData.name.trim()}
                                helperText={
                                    submitAttempted && !formData.name.trim()
                                        ? 'Product name is required'
                                        : ''
                                }
                                sx={fieldSx}
                            />

                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                required
                                error={submitAttempted && !formData.description.trim()}
                                helperText={
                                    submitAttempted && !formData.description.trim()
                                        ? 'Description is required'
                                        : ''
                                }
                                sx={fieldSx}
                            />

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                alignItems="flex-start"
                            >
                                <TextField
                                    label="Position"
                                    type="number"
                                    value={formData.position ?? ''}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            position: v === '' ? null : Number(v),
                                        }));
                                    }}
                                    fullWidth
                                    inputProps={{ min: 0 }}
                                    helperText="Lower numbers appear first in the shop."
                                    sx={fieldSx}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleCheckboxChange}
                                            sx={{
                                                color: alpha(BRAND_BLUE, 0.5),
                                                '&.Mui-checked': { color: BRAND_BLUE },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{ fontWeight: 500, fontSize: '0.9375rem' }}>
                                            Active on storefront
                                        </Typography>
                                    }
                                    sx={{ mt: { sm: 1 }, ml: 0 }}
                                />
                            </Stack>

                            <Box sx={sectionSx}>
                                <Typography sx={{ fontWeight: 700, color: theme.palette.grey[800], mb: 0.5 }}>
                                    Material prices
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                    Per-sticker list price at 50 pcs of 3&quot; × 3&quot;. Size and quantity still follow the pack formula. Leave a material blank to keep the built-in relative rate.
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                                        gap: 2,
                                    }}
                                >
                                    {MATERIAL_PRICE_FIELDS.map((item) => {
                                        const value =
                                            mergeMaterials(formData.materials).find((row) => row.material === item.id)
                                                ?.price ?? 0;
                                        return (
                                            <TextField
                                                key={item.id}
                                                label={item.label}
                                                type="number"
                                                value={value || ''}
                                                onChange={(event) =>
                                                    handleMaterialPriceChange(item.id, event.target.value)
                                                }
                                                inputProps={{ min: 0, step: 0.01 }}
                                                helperText="50-pack unit ($ / sticker)"
                                                sx={fieldSx}
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    label="Max height"
                                    name="maxHeight"
                                    type="number"
                                    value={formData.maxHeight ?? ''}
                                    onChange={handleWholeNumberChange}
                                    fullWidth
                                    required
                                    error={
                                        fieldErrors.maxHeight ||
                                        (submitAttempted &&
                                            (!formData.maxHeight || formData.maxHeight <= 0))
                                    }
                                    helperText={
                                        fieldErrors.maxHeight
                                            ? 'Enter a whole number greater than 0'
                                            : submitAttempted &&
                                                (!formData.maxHeight || formData.maxHeight <= 0)
                                              ? 'Max height is required'
                                              : ''
                                    }
                                    sx={fieldSx}
                                />
                                <TextField
                                    label="Max width"
                                    name="maxWidth"
                                    type="number"
                                    value={formData.maxWidth ?? ''}
                                    onChange={handleWholeNumberChange}
                                    fullWidth
                                    required
                                    error={
                                        fieldErrors.maxWidth ||
                                        (submitAttempted &&
                                            (!formData.maxWidth || formData.maxWidth <= 0))
                                    }
                                    helperText={
                                        fieldErrors.maxWidth
                                            ? 'Enter a whole number greater than 0'
                                            : submitAttempted &&
                                                (!formData.maxWidth || formData.maxWidth <= 0)
                                              ? 'Max width is required'
                                              : ''
                                    }
                                    sx={fieldSx}
                                />
                                <TextField
                                    label="Max quantity"
                                    name="maxQuantity"
                                    type="number"
                                    value={formData.maxQuantity ?? ''}
                                    onChange={handleWholeNumberChange}
                                    fullWidth
                                    required
                                    error={
                                        fieldErrors.maxQuantity ||
                                        (submitAttempted &&
                                            (!formData.maxQuantity || formData.maxQuantity <= 0))
                                    }
                                    helperText={
                                        fieldErrors.maxQuantity
                                            ? 'Enter a whole number greater than 0'
                                            : submitAttempted &&
                                                (!formData.maxQuantity || formData.maxQuantity <= 0)
                                              ? 'Max quantity is required'
                                              : ''
                                    }
                                    sx={fieldSx}
                                />
                            </Box>

                            <Box sx={sectionSx}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mb: 2 }}
                                >
                                    <Typography sx={{ fontWeight: 700, color: theme.palette.grey[800] }}>
                                        Preset dimensions
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={addDimension}
                                        sx={{
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            color: BRAND_BLUE,
                                        }}
                                    >
                                        Add dimension
                                    </Button>
                                </Stack>

                                {formData.dimensions.length === 0 ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        No preset sizes yet. Customers can still enter custom dimensions
                                        up to the max width and height.
                                    </Typography>
                                ) : (
                                    <Stack spacing={1.5}>
                                        {formData.dimensions.map((dim, index) => (
                                            <Stack
                                                key={index}
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                            >
                                                <TextField
                                                    label="Width"
                                                    type="number"
                                                    value={dim.width || ''}
                                                    inputProps={{ min: 0, step: 0.1 }}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const next = raw === '' ? 0 : Number(raw);
                                                        if (Number.isNaN(next)) return;
                                                        handleDimensionChange(index, 'width', next);
                                                    }}
                                                    sx={{ ...fieldSx, flex: 1 }}
                                                />
                                                <TextField
                                                    label="Height"
                                                    type="number"
                                                    value={dim.height || ''}
                                                    inputProps={{ min: 0, step: 0.1 }}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const next = raw === '' ? 0 : Number(raw);
                                                        if (Number.isNaN(next)) return;
                                                        handleDimensionChange(index, 'height', next);
                                                    }}
                                                    sx={{ ...fieldSx, flex: 1 }}
                                                />
                                                <IconButton
                                                    onClick={() => removeDimension(index)}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Stack>
                                        ))}
                                    </Stack>
                                )}
                            </Box>

                            <Box sx={sectionSx}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mb: 2 }}
                                >
                                    <Typography sx={{ fontWeight: 700, color: theme.palette.grey[800] }}>
                                        Quantity discounts
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={addDiscount}
                                        sx={{
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            color: BRAND_BLUE,
                                        }}
                                    >
                                        Add discount
                                    </Button>
                                </Stack>

                                {formData.discounts.length === 0 ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        No bulk discounts configured.
                                    </Typography>
                                ) : (
                                    <Stack spacing={1.5}>
                                        {formData.discounts.map((discount, index) => (
                                            <Stack
                                                key={index}
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                            >
                                                <TextField
                                                    label="Quantity"
                                                    type="number"
                                                    value={discount.quantity}
                                                    error={discount.quantity === 0}
                                                    helperText={
                                                        discount.quantity === 0
                                                            ? 'Must be greater than 0'
                                                            : ''
                                                    }
                                                    onChange={(e) =>
                                                        handleDiscountChange(
                                                            index,
                                                            'quantity',
                                                            parseFloat(e.target.value)
                                                        )
                                                    }
                                                    onBlur={sortDiscountRows}
                                                    sx={{ ...fieldSx, flex: 1 }}
                                                />
                                                <TextField
                                                    label="Discount %"
                                                    type="number"
                                                    value={discount.percentage}
                                                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const next = raw === '' ? 0 : Number(raw);
                                                        if (Number.isNaN(next)) return;
                                                        handleDiscountChange(index, 'percentage', next);
                                                    }}
                                                    sx={{ ...fieldSx, flex: 1 }}
                                                />
                                                <IconButton
                                                    onClick={() => removeDiscount(index)}
                                                    sx={{ color: theme.palette.error.main }}
                                                >
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Stack>
                                        ))}
                                    </Stack>
                                )}
                            </Box>

                            <Stack
                                direction={{ xs: 'column-reverse', sm: 'row' }}
                                spacing={1.5}
                                justifyContent="flex-end"
                                sx={{ pt: 1 }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/products/${formData.productTypeId}`)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 50,
                                        color: theme.palette.grey[700],
                                        borderColor: theme.palette.grey[300],
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!formData.name.trim() || saving}
                                    sx={{
                                        px: 3,
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        borderRadius: 50,
                                        bgcolor: BRAND_BLUE,
                                        boxShadow: `0 4px 16px ${alpha(BRAND_BLUE, 0.25)}`,
                                        '&:hover': { bgcolor: '#124578' },
                                    }}
                                >
                                    {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Stack>
        </DashboardContent>
    );
}
