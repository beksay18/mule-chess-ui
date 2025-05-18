import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Label } from 'src/components/label';

export type ProductItemProps = {
    id: number;
    name: string;
    description: string;
    price: number
    productType: string;
    status: string;
    coverUrl?: string;
    color?: string;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

export function ProductItem({ product }: { product: ProductItemProps }) {
    const baseURL = import.meta.env.VITE_API_BASE_IMAGE_URL;
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 3,
                py: 2,
                gap: 2,
                borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
                bgcolor: 'background.paper',
            }}
        >
            <Avatar
                variant="rounded"
                alt={product.name}
                src={product.coverUrl ? `${baseURL}${product.coverUrl}` : undefined}
                sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    bgcolor: !product.coverUrl ? product.color ?? 'primary.main' : 'transparent',
                    fontSize: 20,
                    fontWeight: 'bold',
                }}
            >
                {!product.coverUrl && product.name.charAt(0)}
            </Avatar>
            <Label
                variant="soft"
                color="info"
                sx={{
                    fontSize: 11,
                    px: 1.2,
                    py: 0.4,
                    borderRadius: 1,
                    textTransform: 'capitalize',
                }}
            >
                {product.productType}
            </Label>
            <ListItemText
                primary={
                    <Typography variant="subtitle2" noWrap>
                        {product.name}
                    </Typography>
                }
                secondary={
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                        {product.description}
                    </Typography>
                }
                sx={{ flexGrow: 1 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Label
                    variant="soft"
                    color="primary"
                    sx={{
                        fontSize: 11,
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 1,
                        textTransform: 'capitalize',
                    }}
                >
                     $ {product.price}
                </Label>
                <Label
                    variant="soft"
                    color={
                        product.status === 'active'
                            ? 'success'
                            : product.status === 'inactive'
                                ? 'default'
                                : 'warning'
                    }
                    sx={{
                        fontSize: 11,
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 1,
                        textTransform: 'capitalize',
                    }}
                >
                    {product.status}
                </Label>

                <IconButton onClick={() => product.onEdit?.(product.id)} size="small">
                    <EditIcon fontSize="small" />
                </IconButton>

                <IconButton onClick={() => product.onDelete?.(product.id)} size="small" color="error">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}
