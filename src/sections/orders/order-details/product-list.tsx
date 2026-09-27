import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

import { LineItemResponse } from '../../../api/orderDetails';

const cardSx = {
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'grey.200',
    boxShadow: 'none',
};

const resolveImageUrl = (imageUrl: string | undefined, baseURL: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl;
    return `${baseURL}${imageUrl}`;
};

const formatDiscount = (percentage: number) => {
    const value = Number(percentage);
    if (!value) return 'None';
    return `${value}% off`;
};

function Spec({ label, value }: { label: string; value: string }) {
    return (
        <Box
            sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 1.5,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.100',
            }}
        >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: 'grey.900', mt: 0.25 }}>{value}</Typography>
        </Box>
    );
}

function ArtworkFile({ imageUrl, index, baseURL }: { imageUrl: string; index: number; baseURL: string }) {
    const artworkUrl = resolveImageUrl(imageUrl, baseURL);

    return (
        <Box sx={{ width: 140 }}>
            <Box
                component="a"
                href={artworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    display: 'block',
                    width: 140,
                    height: 140,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    bgcolor: 'grey.50',
                }}
            >
                <Box
                    component="img"
                    src={artworkUrl}
                    alt={`Artwork ${index + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </Box>
            <Typography
                component="a"
                href={artworkUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                sx={{ display: 'inline-block', mt: 0.75, fontWeight: 700, color: 'primary.main' }}
            >
                Download artwork {index + 1}
            </Typography>
        </Box>
    );
}

export function ProductList({ lineItems, baseURL }: { lineItems: LineItemResponse[]; baseURL: string }) {
    const countLabel = `${lineItems.length} item${lineItems.length === 1 ? '' : 's'}`;

    return (
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, md: 2.5 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Inventory2OutlinedIcon fontSize="small" color="action" />
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Products</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    {countLabel}
                </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={3} divider={<Divider flexItem />}>
                {lineItems.map((item, index) => {
                    const imageUrl = resolveImageUrl(item.imageUrl, baseURL);
                    const artworks = item.artworks ?? [];

                    return (
                        <Box key={`${item.productId}-${index}`}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        flexShrink: 0,
                                        borderRadius: 1.5,
                                        overflow: 'hidden',
                                        border: '1px solid',
                                        borderColor: 'grey.200',
                                        bgcolor: 'grey.50',
                                    }}
                                >
                                    {imageUrl ? (
                                        <Box
                                            component="img"
                                            src={imageUrl}
                                            alt={item.productName}
                                            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : null}
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 800, color: 'grey.900' }}>
                                        {item.productName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Product #{item.productId}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                                    gap: 1.25,
                                }}
                            >
                                <Spec label="Size" value={`${item.width}" × ${item.height}"`} />
                                <Spec label="Size type" value={item.isCustomDimension ? 'Custom' : 'Standard'} />
                                <Spec label="Quantity" value={String(item.quantity)} />
                                <Spec label="Discount" value={formatDiscount(item.percentage)} />
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography sx={{ fontWeight: 800, mb: 1 }}>Artwork</Typography>
                                {artworks.length > 0 ? (
                                    <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                                        {artworks.map((url, artworkIndex) => (
                                            <ArtworkFile
                                                key={`${url}-${artworkIndex}`}
                                                imageUrl={url}
                                                index={artworkIndex}
                                                baseURL={baseURL}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No artwork was uploaded for this item.
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Paper>
    );
}
