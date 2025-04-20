import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Label } from 'src/components/label';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export type ProductItemProps = {
    id: number;
    name: string;
    status: string;
    coverUrl?: string;
    color?: string;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
};

export function ProductItem({ product }: { product: ProductItemProps }) {
    const IMAGE_HEIGHT = 200;

    const renderImage = product.coverUrl ? (
        <Box
            component="img"
            alt={product.name}
            src={product.coverUrl}
            sx={{
                width: '100%',
                height: IMAGE_HEIGHT,
                objectFit: 'cover',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
            }}
        />
    ) : (
        <Box
            sx={{
                width: '100%',
                height: IMAGE_HEIGHT,
                backgroundColor: product.color ?? '#E0E0E0',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
            }}
        >
            {product.name.charAt(0)}
        </Box>
    );

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                },
            }}
        >
            {renderImage}

            <Stack spacing={1.5} sx={{ p: 2 }}>
                <Typography variant="h6" noWrap>
                    {product.name}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                            textTransform: 'capitalize',
                            fontSize: 12,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1.5,
                        }}
                    >
                        {product.status}
                    </Label>
                    <Box>
                        <IconButton onClick={() => product.onEdit?.(product.id)} size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => product.onDelete?.(product.id)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Stack>
        </Card>
    );
}
