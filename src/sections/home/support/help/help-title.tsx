import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useRouter} from "../../../../routes/hooks";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backdropFilter: 'blur(24px)',
    flexWrap: 'wrap',
    gap: theme.spacing(25),
}));

export default function HelpTitle() {
    const router = useRouter();

    const handleContactUsClick = () => {
        router.push(`/contact-us`);
    };

    return (
        <Box sx={{
            background: '#f4f4f4',
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
                        HELP
                    </Typography>

                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 },
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            borderRadius: 2,
                            backgroundColor: 'white',
                            color: '#175195',
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                transform: 'scale(1.05)',
                            },
                        }}
                        onClick={() => handleContactUsClick()}
                    >
                        Email support
                    </Button>
                </StyledToolbar>
            </Container>
        </Box>
    );
}