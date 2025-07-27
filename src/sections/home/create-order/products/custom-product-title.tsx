import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getProductTypeById, ProductType} from "../../../../api/productType";
import FilterIcon from '@mui/icons-material/Filter';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SelectAllIcon from '@mui/icons-material/SelectAll';

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    backdropFilter: 'blur(24px)',
}));

export default function CustomProductTitle() {
    const {typeId} = useParams();
    const [productType, setProductType] = useState<ProductType | null>(null);

    useEffect(() => {
        if (typeId) {
            getProductTypeById(Number(typeId)).then(setProductType);
        }
    }, [typeId]);

    return (
        <Box sx={{background: '#f4f4f4', py: 2}}>
            <Container>
                <StyledToolbar variant="dense" sx={{justifyContent: 'space-between'}}>
                    <Box sx={{
                        flexGrow: 1,
                        px: 2,
                        display: 'flex'
                    }}>
                        <CloudUploadIcon sx={{color: '#4f7277', fontSize: 40, mr: 2}}/>
                        <Box>
                            <Typography
                                component="div"
                                sx={{color: '#4f7277', fontWeight: 'bold'}}
                            >
                                Upload {productType?.name}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{color: '#888', fontStyle: 'italic', mt: 0.5, fontSize: 11}}
                            >
                                High-quality custom printing made easy
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        px: 2,
                        display: 'flex'
                    }}>
                        <FilterIcon sx={{color: '#4f7277', fontSize: 40, mr: 2}}/>
                        <Box>
                            <Typography
                                component="div"
                                sx={{color: '#4f7277', fontWeight: 'bold'}}
                            >
                                Change Background
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{color: '#888', fontStyle: 'italic', mt: 0.5, fontSize: 11}}
                            >
                                High-quality custom printing made easy
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        px: 2,
                        display: 'flex'
                    }}>
                        <SelectAllIcon sx={{color: '#4f7277', fontSize: 40, mr: 2}}/>
                        <Box>
                            <Typography
                                component="div"
                                sx={{color: '#4f7277', fontWeight: 'bold'}}
                            >
                                Select Stickers
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{color: '#888', fontStyle: 'italic', mt: 0.5, fontSize: 11}}
                            >
                                High-quality custom printing made easy
                            </Typography>
                        </Box>
                    </Box>
                </StyledToolbar>
            </Container>
        </Box>
    );
}
