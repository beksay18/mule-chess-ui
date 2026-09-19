import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from '../../routes/hooks';

const BRAND_BLUE = '#175195';
const IMAGE_HEIGHT = 160;

export type ProductItemProps = {
    id: number;
    name: string;
    status: string;
    coverUrl?: string;
    position?: number;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

export function ProductTypeItem({ product }: { product: ProductItemProps }) {
    const theme = useTheme();
    const router = useRouter();
    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';
    const isActive = product.status === 'active';

    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <Box
            onClick={handleCardClick}
            sx={{
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                bgcolor: '#ffffff',
                boxShadow: `0 4px 20px ${alpha(BRAND_BLUE, 0.06)}`,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: alpha(BRAND_BLUE, 0.25),
                    boxShadow: `0 12px 32px ${alpha(BRAND_BLUE, 0.12)}`,
                    '& .view-products': {
                        color: BRAND_BLUE,
                        '& .MuiSvgIcon-root': { transform: 'translateX(3px)' },
                    },
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
                            width: 64,
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(BRAND_BLUE, 0.1),
                            color: BRAND_BLUE,
                        }}
                    >
                        <StyleOutlinedIcon sx={{ fontSize: 32 }} />
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
                            mb: 1,
                        }}
                        noWrap
                    >
                        {product.name}
                    </Typography>

                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
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
                                label={
                                    product.position === 1
                                        ? 'Home featured'
                                        : `Position ${product.position}`
                                }
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
                </Box>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ pt: 0.5, borderTop: `1px solid ${theme.palette.grey[100]}` }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        className="view-products"
                        sx={{
                            color: theme.palette.grey[600],
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            transition: 'color 0.2s ease',
                        }}
                    >
                        Manage products
                        <ArrowForwardIcon
                            sx={{ fontSize: 16, transition: 'transform 0.2s ease' }}
                        />
                    </Stack>

                    <Stack direction="row" spacing={0.25}>
                        <Tooltip title="Edit type">
                            <IconButton
                                size="small"
                                onClick={(e) =>
                                    handleActionClick(e, () => product.onEdit?.(product.id))
                                }
                                sx={{ color: BRAND_BLUE }}
                            >
                                <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete type">
                            <IconButton
                                size="small"
                                onClick={(e) =>
                                    handleActionClick(e, () => product.onDelete?.(product.id))
                                }
                                sx={{ color: theme.palette.error.main }}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
}
