import {Box, Typography, Avatar, Stack, Divider, Card, CardContent} from '@mui/material';
import { Icon } from '@iconify/react';
import React from 'react';

interface ArtworkProps {
    imageUrl: string;
    index: number;
    baseURL: string;
}

const Artwork = ({ imageUrl, index, baseURL }: ArtworkProps) => {
    const artworkUrl = `${baseURL}${imageUrl}`;
    return (
        <Box
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, ml: 8 }}
        >
            <img
                src={artworkUrl}
                alt={`Artwork ${index + 1}`}
                style={{ width: 80, height: 'auto', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <a
                href={artworkUrl}
                download={`artwork-${index + 1}.png`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: 'primary.dark' } }}>
                    Download Artwork {index + 1}
                </Typography>
            </a>
        </Box>
    );
};

export function ProductList({ lineItems, baseURL }: { lineItems: any[]; baseURL: string }) {
    return (
        <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
            <Typography variant="h6" gutterBottom>
                <Icon icon="mdi:cart" style={{ marginRight: 8 }} />
                Products
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {lineItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box display="flex" alignItems="center" flex={1}>
                            <Avatar src={item.imageUrl} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
                            <Box>
                                <Typography fontWeight={500}>{item.productName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.width}&quot; x {item.height}&quot; · {item.isCustomDimension ? 'Custom' : 'Standard'}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" flex={1}>
                            Qty: {item.quantity}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                            {item.percentage}%
                        </Typography>
                    </Stack>
                    <>
                        {item.artworks.map((url: string, i: number) => (
                            <Artwork key={i} imageUrl={url} index={i} baseURL={baseURL} />
                        ))}
                    </>
                    {index < lineItems.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
            ))}
            </CardContent>
        </Card>
    );
}