import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from "@mui/material/TextField";
import {useParams} from "react-router-dom";
import {useRouter} from "../../../../routes/hooks";
import Button from "@mui/material/Button";

export default function UploadArtwork() {
    const { id } = useParams();
    const router = useRouter();

    const handleUploadFiles = () => {
    };

    const handleAddToCart = () => {
        router.push(`/cart`);
    };

    const handleBack = () => {
        router.push(`/custom-product-details/${id}`);
    };

    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
            })}
        >
            <Container
                id="pricing"
                sx={{
                    pt: {xs: 4, sm: 8},
                    pb: {xs: 8, sm: 16},
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                <Typography variant="h2" sx={{textAlign: 'center', fontWeight: 'bold'}}>
                    Upload Artwork
                </Typography>
                <Box
                    onClick={handleUploadFiles}
                    sx={{
                        border: '2px dashed grey',
                        width: '100%',
                        maxWidth: 500,
                        height: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.02)',
                        },
                    }}
                >
                    <CloudUploadIcon sx={{fontSize: 40, color: 'gray'}}/>
                    <Typography variant="body1" sx={{color: 'gray', mt: 1}}>
                        Drop files here to upload
                    </Typography>
                </Box>
                <Box sx={{ width: '100%', maxWidth: 500 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                        Instructions (optional)
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Let us know if you have any instructions to prepare your proof."
                        variant="outlined"
                    />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    or, you can skip this step and email your artwork to us later.
                </Typography>
                <Box
                    sx={{
                        mt: 4,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleAddToCart}
                        sx={{ fontWeight: 'bold', textTransform: 'none', px: 4 }}
                    >
                        Add to cart
                    </Button>

                    <Typography
                        onClick={handleBack}
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        BACK
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
