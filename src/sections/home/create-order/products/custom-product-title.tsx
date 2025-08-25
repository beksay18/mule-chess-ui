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
import {getProductTypeReviewSummary} from "../../../../api/reviews";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    backdropFilter: 'blur(24px)',
}));

export default function CustomProductTitle() {
    const {typeId} = useParams();
    const [productType, setProductType] = useState<ProductType | null>(null);
    const [avgRating, setAvgRating] = useState<number>(0);
    const [totalReviewer, setTotalReviewers] = useState<number>(0);

    useEffect(() => {
        if (typeId) {
            getProductTypeById(Number(typeId)).then(setProductType);
            getProductTypeReviewSummary(Number(typeId)).then((summary) => {
                setAvgRating(summary.averageRating ?? 0);
                setTotalReviewers(summary.totalReviews ?? 0);
            });
        }
    }, [typeId]);

    return (
        <Box sx={{background: '#DAE6F2', py: 3}}>
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
                    <Rating name="text-feedback" value={Math.min(5, Math.max(0, avgRating || 0))} precision={0.5} sx={{ ml: 4 }} readOnly />
                    <Box sx={{ ml: 2, color: '#4f7277' }}>({totalReviewer} {totalReviewer === 1 ? "review" : "reviews"})</Box>
                </StyledToolbar>
            </Container>
        </Box>
    );
}
