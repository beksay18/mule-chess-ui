import * as React from 'react';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";
import {getActiveProductTypes, ProductType} from "../../api/productType";
import {Paper} from "@mui/material";
import Grid from "@mui/material/Grid";

export default function HomeProducts() {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    useEffect(() => {
        loadProductTypes();
    }, []);

    const loadProductTypes = async () => {
        const data = await getActiveProductTypes();
        setProductTypes(data);
    };

    return (
        <Box id="logoCollection" sx={{ py: 4 }}>
            <Grid container spacing={3} justifyContent="center">
                {productTypes.map((productType) => (
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                width: 160,
                                height: 100,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                textAlign: 'center',
                            }}
                        >
                            {productType.name}
                        </Paper>
                ))}
            </Grid>
        </Box>
    );
}
