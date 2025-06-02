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
    padding: '15px 12px',
}));

export default function ContactUsTitle() {

    return (
        <Box sx={{
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            py: 2
        }}>
            <Container>
                <StyledToolbar variant="dense">
                    <Typography
                        component="span"
                        variant="h2"
                        sx={(theme) => ({
                            fontSize: 'inherit',
                            color: 'white',
                        })}
                    >
                        Contact Us
                    </Typography>
                </StyledToolbar>
            </Container>
        </Box>
    );
}