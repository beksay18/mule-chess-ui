import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import { alpha, useTheme } from '@mui/material/styles';

const BRAND_BLUE = '#175195';
const IMAGE_HEIGHT = 140;

export type ProductItemProps = {
    id: number;
    name: string;
    description: string;
    price: number;
    productType: string;
    status: string;
    coverUrl?: string;
    position?: number;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

export function ProductItem({ product }: { product: ProductItemProps }) {
    const theme = useTheme();
    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';
    const isActive = product.status === 'active';

    return (
        <Box
            sx={{
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                bgcolor: '#ffffff',
                boxShadow: `0 4px 20px ${alpha(BRAND_BLUE, 0.06)}`,
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: alpha(BRAND_BLUE, 0.25),
                    boxShadow: `0 12px 32px ${alpha(BRAND_BLUE, 0.12)}`,
                },
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: IMAGE_HEIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(BRAND_BLUE, 0.04),
                    borderBottom: `1px solid ${theme.palette.grey[100]}`,
                    overflow: 'hidden',
                }}
            >
                {product.coverUrl ? (
                    <Box
                        component="img"
                        alt={product.name}
                        src={`${baseURL}${product.coverUrl}`}
                        sx={{
                            maxWidth: '88%',
                            maxHeight: '88%',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(BRAND_BLUE, 0.1),
                            color: BRAND_BLUE,
                        }}
                    >
                        <StyleOutlinedIcon sx={{ fontSize: 28 }} />
                    </Box>
                )}
            </Box>

            <Stack spacing={1.5} sx={{ p: 2.5 }}>
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: '1rem',
                            color: theme.palette.grey[900],
                            letterSpacing: '-0.01em',
                            mb: 0.5,
                        }}
                        noWrap
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.5em',
                        }}
                    >
                        {product.description}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    <Chip
                        label={`$${(Number(product.price) || 0).toFixed(2)}`}
                        size="small"
                        sx={{
                            height: 24,
                            fontWeight: 700,
                            fontSize: '0.6875rem',
                            bgcolor: alpha(BRAND_BLUE, 0.1),
                            color: BRAND_BLUE,
                        }}
                    />
                    <Chip
                        label={isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                            height: 24,
                            fontWeight: 700,
                            fontSize: '0.6875rem',
                            bgcolor: isActive
                                ? alpha('#4caf50', 0.12)
                                : alpha(theme.palette.grey[500], 0.12),
                            color: isActive ? '#2e7d32' : theme.palette.grey[700],
                        }}
                    />
                    {product.position != null && (
                        <Chip
                            label={`Position ${product.position}`}
                            size="small"
                            sx={{
                                height: 24,
                                fontWeight: 700,
                                fontSize: '0.6875rem',
                                bgcolor: alpha(BRAND_BLUE, 0.1),
                                color: BRAND_BLUE,
                            }}
                        />
                    )}
                </Stack>

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={0.25}
                    sx={{ pt: 0.5, borderTop: `1px solid ${theme.palette.grey[100]}` }}
                >
                    <Tooltip title="Edit product">
                        <IconButton
                            size="small"
                            onClick={() => product.onEdit?.(product.id)}
                            sx={{ color: BRAND_BLUE }}
                        >
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete product">
                        <IconButton
                            size="small"
                            onClick={() => product.onDelete?.(product.id)}
                            sx={{ color: theme.palette.error.main }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
        </Box>
    );
}
