import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
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
import { createProductType, getProductTypeById, updateProductType } from '../../api/productType';
import { DashboardContent } from '../../layouts/dashboard';

const BRAND_BLUE = '#175195';

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

export default function ProductTypeForm() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEdit = Boolean(id);

    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [position, setPosition] = useState<number | ''>('');
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';

    useEffect(() => {
        if (!id) {
            return;
        }

        setLoading(true);
        getProductTypeById(Number(id))
            .then((data) => {
                setName(data.name);
                setIsActive(data.isActive);
                setPosition(data.position ?? '');
                setExistingImageUrl(data.imageUrl ?? null);
            })
            .catch((error) => {
                console.error('Failed to load product type:', error);
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        let previewUrl: string | null = null;

        if (image) {
            previewUrl = URL.createObjectURL(image);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(null);
        }

        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [image]);

    const displayImageUrl = useMemo(() => {
        if (imagePreview) {
            return imagePreview;
        }
        if (existingImageUrl) {
            return `${baseURL}${existingImageUrl}`;
        }
        return null;
    }, [imagePreview, existingImageUrl, baseURL]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        setSubmitAttempted(true);

        if (!name.trim()) {
            return;
        }

        try {
            setSaving(true);
            const payload = {
                name,
                isActive,
                image: image ?? undefined,
                position: position === '' ? undefined : Number(position),
            };

            if (id) {
                await updateProductType(Number(id), payload);
            } else {
                await createProductType(payload);
            }

            navigate('/products-types');
        } catch (error) {
            console.error('Failed to save product type:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
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
                        onClick={() => navigate('/products-types')}
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
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                        {isEdit
                            ? 'Update this sticker category and its storefront image.'
                            : 'Create a new sticker category for the shop.'}
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
                        <Box
                            sx={{
                                width: { xs: '100%', md: 320 },
                                flexShrink: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    color: theme.palette.grey[800],
                                    mb: 1.5,
                                }}
                            >
                                Category image
                            </Typography>

                            {displayImageUrl ? (
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
                                        minHeight: 220,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={displayImageUrl}
                                        alt={name || 'Product type preview'}
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: 240,
                                            objectFit: 'contain',
                                            display: 'block',
                                        }}
                                    />
                                    {image && (
                                        <IconButton
                                            size="small"
                                            aria-label="Remove selected image"
                                            onClick={handleRemoveImage}
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
                                    p: 3,
                                    minHeight: displayImageUrl ? 120 : 220,
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
                                <CloudUploadOutlinedIcon
                                    sx={{ fontSize: 32, color: alpha(BRAND_BLUE, 0.55) }}
                                />
                                <Typography sx={{ fontWeight: 600, color: BRAND_BLUE, textAlign: 'center' }}>
                                    {displayImageUrl ? 'Replace image' : 'Upload image'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    PNG, JPG, or WEBP
                                </Typography>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Box>

                            {image && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                    New file selected: {image.name}
                                </Typography>
                            )}
                            {!image && existingImageUrl && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                    Current image shown above. Upload a new file to replace it.
                                </Typography>
                            )}
                        </Box>

                        <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                                label="Product type name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                required
                                error={submitAttempted && !name.trim()}
                                helperText={
                                    submitAttempted && !name.trim() ? 'Name is required' : ''
                                }
                                sx={fieldSx}
                            />

                            <TextField
                                label="Position"
                                type="number"
                                value={position}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setPosition(v === '' ? '' : Number(v));
                                }}
                                fullWidth
                                inputProps={{ min: 0 }}
                                helperText="Use 1 to feature this type on the homepage."
                                sx={fieldSx}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
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
                            />

                            <Stack
                                direction={{ xs: 'column-reverse', sm: 'row' }}
                                spacing={1.5}
                                justifyContent="flex-end"
                                sx={{ pt: 1 }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/products-types')}
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
                                    disabled={!name.trim() || saving}
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
                                    {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create type'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Stack>
        </DashboardContent>
    );
}
