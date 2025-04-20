import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {
    Box,
    Card,
    TextField,
    Typography,
    Stack,
    Button, FormControlLabel,
} from '@mui/material';

import {Iconify} from 'src/components/iconify';
import {createProductType} from '../../api/productType';
import {DashboardContent} from "../../layouts/dashboard";
import Checkbox from "@mui/material/Checkbox";

export default function ProductTypeForm() {
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            await createProductType({name, isActive});
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

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                            }
                            label="Active"
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
