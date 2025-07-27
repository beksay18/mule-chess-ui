import * as React from 'react';
import Box from '@mui/material/Box';
import {useParams} from 'react-router-dom';
import CustomProductTitle from './custom-product-title';
import {useRouter} from '../../../../routes/hooks';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import {removeImageBackground} from "../../../../api/imageBackground";
import {useEffect, useState} from "react";
import {getActiveProducts, Product} from "../../../../api/product";

export default function CustomProducts() {
    const router = useRouter();
    const {typeId} = useParams();
    const [customProducts, setCustomProducts] = useState<Product[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [processedImage, setProcessedImage] = React.useState<string | null>(null);
    const [imageShape, setImageShape] =
        React.useState<'square' | 'rounded' | 'circle' | 'rectangle' | 'oval'>('rounded');
    const [roundedRadius, setRoundedRadius] = React.useState(10);
    const [ovalRadius, setOvalRadius] = React.useState(50);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedProductName, setSelectedProductName] = useState<string | null>(null);

    useEffect(() => {
        if (typeId) {
            loadProductsByType(Number(typeId));
        }
    }, [typeId]);

    const loadProductsByType = async (id: number) => {
        const data = await getActiveProducts(id);
        setCustomProducts(data);
    };

    const handleUploadFiles = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const newFile = event.target.files[0];
            setSelectedFiles([newFile]);
            event.target.value = '';
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveBackground = async () => {
        if (!selectedFiles[0]) return;

        try {
            setLoading(true);
            const blob = await removeImageBackground(selectedFiles[0]);
            const imageUrl = URL.createObjectURL(blob);
            setProcessedImage(imageUrl);
        } catch (err) {
            console.error("Failed to remove background:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleShapeChangeFromProduct = (productName: string) => {
        const lower = productName.toLowerCase();
        if (lower.includes('circle')) {
            setImageShape('circle');
        } else if (lower.includes('square')) {
            setImageShape('square');
        } else if (lower.includes('rounded')) {
            setImageShape('rounded');
        } else if (lower.includes('rectangle')) {
            setImageShape('rectangle');
        } else if (lower.includes('oval')) {
            setImageShape('oval');
        } else {
            setImageShape('rounded');
        }
    };


    return (
        <>
            <CustomProductTitle/>
            <Container sx={{mt: 5, pb: 10}}>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Box sx={{flex: '0 0 55%'}}>
                        <Paper sx={{p: 3}}>
                            <Box
                                onClick={() => {
                                    if (selectedFiles.length === 0) {
                                        handleUploadFiles();
                                    }
                                }}
                                sx={{
                                    border: selectedFiles.length === 0 ? '2px dashed grey' : 'none',
                                    width: '100%',
                                    maxWidth: 700,
                                    height: 400,
                                    mb: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: selectedFiles.length === 0 ? 'pointer' : 'default',
                                    position: 'relative',
                                    '&:hover': {
                                        backgroundColor: selectedFiles.length === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                                    },
                                }}
                            >
                                {selectedFiles.length > 0 ? (
                                    <Box
                                        component="img"
                                        src={processedImage || URL.createObjectURL(selectedFiles[0])}
                                        alt="Uploaded"
                                        sx={{
                                            width: imageShape === 'square' ? '100%' : '100%',
                                            height: imageShape === 'square' ? 'auto' : '100%',
                                            maxWidth: imageShape === 'square' || imageShape === 'circle' ? 400 : '100%',
                                            maxHeight: 400,
                                            aspectRatio:
                                                imageShape === 'square' ? '1 / 1' :
                                                    imageShape === 'rectangle' ? '4 / 3' :
                                                        'auto',
                                            objectFit: 'cover',
                                            p: 1,
                                            m: 3,
                                            borderRadius:
                                                imageShape === 'circle'
                                                    ? '50%'
                                                    : imageShape === 'oval'
                                                        ? `${ovalRadius}% / 50%`
                                                        : imageShape === 'rounded'
                                                            ? `${roundedRadius}%`
                                                            : 0,
                                            border: '2px solid #ccc',
                                            display: 'block',
                                            mx: 'auto',
                                        }}
                                    />
                                ) : (
                                    <>
                                        <CloudUploadIcon sx={{fontSize: 40, color: 'gray'}}/>
                                        <Typography variant="body1" sx={{color: 'gray', mt: 1}}>
                                            Drop a file here to upload
                                        </Typography>
                                    </>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={selectedFiles.length > 0}
                                />

                                {selectedFiles.length > 0 && (
                                    <Box
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFile(0);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: '#fff',
                                            border: '1px solid #ccc',
                                            borderRadius: '50%',
                                            width: 24,
                                            height: 24,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: 14,
                                            color: 'red',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ✕
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{width: '100%', maxWidth: 700}}>
                                {selectedFiles.length > 0 && (
                                    <>
                                        <Box mb={2}>
                                            <button
                                                onClick={handleRemoveBackground}
                                                disabled={loading}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#1976d2',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {loading ? 'Processing...' : 'Remove Background'}
                                            </button>
                                        </Box>
                                    </>
                                )}
                            </Box>
                            <Box sx={{width: '100%', maxWidth: 700}}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{fontWeight: 'bold', mb: 1}}
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
                            <Typography variant="body2" sx={{color: 'text.secondary', textAlign: 'center'}}>
                                or, you can skip this step and email your artwork to us later.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box sx={{flex: '0 0 45%'}}>
                        <Paper sx={{p: 3}}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#4f7277',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontWeight: 500
                                }}
                                component="a"
                                href="/help/selecting-stickers"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Need help selecting stickers?
                            </Typography>

                            <Box display="flex" gap={1} mb={2} mt={2} flexWrap="wrap">
                                {customProducts.map((product) => {
                                    const lowerName = product.name.toLowerCase();
                                    const showSuffix = !lowerName.includes("sticker") && !lowerName.includes("sheet");

                                    return (
                                        <Box
                                            key={product.id}
                                            onClick={() => {
                                                setSelectedProductId(product.id);
                                                setSelectedProductName(product.name);
                                                handleShapeChangeFromProduct(product.name);
                                            }}
                                            component="button"
                                            sx={{
                                                padding: '8px 12px',
                                                backgroundColor: selectedProductId === product.id ? '#d0f0e8' : '#f0f0f0',
                                                border: selectedProductId === product.id ? '2px solid #08A24B' : '1px solid #ccc',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'background-color 0.3s',
                                                '&:hover': {
                                                    backgroundColor: selectedProductId === product.id ? '#bce9db' : '#e0e0e0',
                                                }
                                            }}
                                        >
                                            {product.name}{showSuffix ? ' Stickers' : ''}
                                        </Box>
                                    );
                                })}
                            </Box>

                            {selectedFiles.length > 0 && selectedProductName?.toLowerCase().includes('rounded') && (
                                <Box sx={{ mb: 3, mt: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Rounded Border Radius ({roundedRadius}%)
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <input
                                            type="range"
                                            min={0}
                                            max={50}
                                            step={1}
                                            value={roundedRadius}
                                            onChange={(e) => setRoundedRadius(Number(e.target.value))}
                                            style={{ width: '100%'}}
                                        />
                                    </Box>
                                </Box>
                            )}

                            {selectedFiles.length > 0 && selectedProductName?.toLowerCase().includes('oval') && (
                                <Box sx={{ mb: 3, mt: 3 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Oval Border Radius ({ovalRadius}%)
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <input
                                            type="range"
                                            min={0}
                                            max={50}
                                            step={1}
                                            value={ovalRadius}
                                            onChange={(e) => setOvalRadius(Number(e.target.value))}
                                            style={{ width: '100%' }}
                                        />
                                    </Box>
                                </Box>
                            )}

                            <Box
                                component="button"
                                sx={{
                                    backgroundColor: '#4f7277',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    px: 3,
                                    py: 1.5,
                                    mt: 5,
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                        backgroundColor: '#2b3e41',
                                    },
                                    width: '100%',
                                    alignSelf: 'center',
                                }}
                            >
                                Next
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
