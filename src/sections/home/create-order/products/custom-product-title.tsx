import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getProductTypeById, ProductType} from "../../../../api/productType";
import {Rating} from "@mui/material";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    backdropFilter: 'blur(24px)',
}));

export default function CustomProductTitle() {
    const { typeId } = useParams();
    const [productType, setProductType] = useState<ProductType | null>(null);

    useEffect(() => {
        if (typeId) {
            getProductTypeById(Number(typeId)).then(setProductType);
        }
    }, [typeId]);

    return (
        <Box sx={{
            background: '#f4f4f4',
            py: 2
        }}>
            <Container>
                <StyledToolbar variant="dense">
                    <Typography
                        component="span"
                        variant="h3"
                        sx={(theme) => ({
                            fontSize: 'inherit',
                            color: '#4f7277',
                        })}
                    >
                        Custom {productType?.name}
                    </Typography>
                    <Rating
                        name="text-feedback"
                        value={3.5}
                        readOnly
                        precision={0.5}
                        sx={{ ml: 4 }}
                    />
                    <Box sx={{ ml: 2, color: '#4f7277' }}>10,000 reviews</Box>
                </StyledToolbar>
            </Container>
        </Box>
    );
}