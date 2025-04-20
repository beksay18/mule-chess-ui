import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {
    Box,
    Card,
    TextField,
    Typography,
    Stack,
    Button,
} from '@mui/material';

import {Iconify} from 'src/components/iconify';
import {createProductType} from '../../api/productType';
import {DashboardContent} from "../../layouts/dashboard";

export default function ProductTypeForm() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            await createProductType({name});
            navigate('/products');
        } catch (error) {
            console.error('Failed to create product type:', error);
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

                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line"/>}
                            onClick={handleSubmit}
                            disabled={!name.trim()}
                        >
                            Save
                        </Button>
                    </Stack>
                </Card>
            </Box>
        </DashboardContent>
    );
}
