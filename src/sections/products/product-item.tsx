import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Label } from 'src/components/label';

export type ProductItemProps = {
    id: number;
    name: string;
    description: string;
    status: string;
    coverUrl?: string;
    color?: string;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

export function ProductItem({ product }: { product: ProductItemProps }) {
    const avatarContent = product.coverUrl ? (
        <Avatar
            variant="rounded"
            alt={product.name}
            src={product.coverUrl}
            sx={{ width: 64, height: 64, flexShrink: 0 }}
        />
    ) : (
        <Avatar
            variant="rounded"
            sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                bgcolor: product.color ?? '#ccc',
                fontSize: 28,
                fontWeight: 'bold',
                textTransform: 'uppercase',
            }}
        >
            {product.name.charAt(0)}
        </Avatar>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 2,
                gap: 2,
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: 'background.paper',
                border: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
        >
            {avatarContent}

            <ListItemText
                primary={
                    <Typography variant="subtitle1" noWrap>
                        {product.name}
                    </Typography>
                }
                secondary={
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ mt: 0.5 }}
                    >
                        {product.description}
                    </Typography>
                }
                sx={{ flexGrow: 1 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
