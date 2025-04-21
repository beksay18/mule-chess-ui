import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Card,
    TextField,
    Typography,
    Stack,
    Button, FormControlLabel,
} from '@mui/material';
import {Iconify} from 'src/components/iconify';
import {createProductType, getProductTypeById, updateProductType} from '../../api/productType';
import {DashboardContent} from "../../layouts/dashboard";
import Checkbox from "@mui/material/Checkbox";

export default function ProductTypeForm() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getProductTypeById(Number(id)).then((data) => {
                setName(data.name);
                setIsActive(data.isActive);
            });
        }
    }, [id]);

    const handleSubmit = async () => {
        try {
            if (id) {
                await updateProductType(Number(id), { name, isActive });
            } else {
                await createProductType({ name, isActive });
            }
            navigate('/product-types');
        } catch (error) {
            console.error('Failed to save product type:', error);
        }
    };

    return (
        <DashboardContent>
            <Box>
                <Typography variant="h4" sx={{mb: 3}}>
                    Product Type
                </Typography>

                <Card sx={{p: 3}}>
                    <Stack spacing={3}>
                        <TextField
                            label="Product Type Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                            }
                            label="Active"
                        />

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="mingcute:add-line" />}
                                onClick={handleSubmit}
                                disabled={!name.trim()}
                            >
                                {id ? 'Update' : 'Create'}
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Box>
        </DashboardContent>
    );
}
