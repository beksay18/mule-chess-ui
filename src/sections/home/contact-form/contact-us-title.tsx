import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    backdropFilter: 'blur(24px)',
}));

export default function ContactUsTitle() {

    return (
        <Box sx={{
            background: '#DAE6F2',
            py: 2
        }}>
            <Container>
                <StyledToolbar variant="dense">
                    <Typography
                        component="span"
                        variant="h2"
                        sx={(theme) => ({
                            fontSize: 'inherit',
                            color: '#4f7277'
                        })}
                    >
                        Contact Us
                    </Typography>
                </StyledToolbar>
            </Container>
        </Box>
    );
}