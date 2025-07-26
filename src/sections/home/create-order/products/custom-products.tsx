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

export default function CustomProducts() {
    const router = useRouter();
    const {typeId} = useParams();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [loading, setLoading] = React.useState(false);

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
                                    border: '2px dashed grey',
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
                                        src={URL.createObjectURL(selectedFiles[0])}
                                        alt="Uploaded"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            p: 1,
                                        }}
                                    />
                                ) : (
                                    <>
                                        <CloudUploadIcon sx={{ fontSize: 40, color: 'gray' }} />
                                        <Typography variant="body1" sx={{ color: 'gray', mt: 1 }}>
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
                                            e.stopPropagation(); // prevent triggering upload
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
                            <Box sx={{ width: '100%', maxWidth: 700 }}>
                                {selectedFiles.length > 0 && (
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
                                )}
                            </Box>
                            <Box sx={{ width: '100%', maxWidth: 700 }}>
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
                        </Paper>
                    </Box>
                    <Box sx={{flex: '0 0 45%'}}>
                        <Paper sx={{p: 3}}>
                            <Typography variant="h3" sx={{textAlign: 'center', fontWeight: 'bold'}}>
                                Upload Artwork
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
