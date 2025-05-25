import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useRouter} from "../../routes/hooks";
import {useEffect, useState} from "react";
import {getActiveProductTypes, ProductType} from "../../api/productType";

export default function HomeOverview() {
    const [randomProductType, setRandomProductType] = useState<ProductType | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadTypes = async () => {
            const types = await getActiveProductTypes();
            if (types.length > 0) {
                const random = types[Math.floor(Math.random() * types.length)];
                setRandomProductType(random);
            }
        };

        loadTypes();
    }, []);


    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
            })}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 4, sm: 10 },
                    pb: { xs: 4, sm: 7 },
                }}
            >
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                        }}
                    >
                        Create&nbsp;custom&nbsp;
                        <Typography
                            component="span"
                            variant="h2"
                            sx={(theme) => ({
                                fontSize: 'inherit',
                                color: 'primary.main',
                                ...theme.applyStyles('dark', {
                                    color: 'primary.light',
                                }),
                            })}
                        >
                            stickers,&nbsp;
                        </Typography>
                        <Typography
                            component="span"
                            variant="h2"
                            sx={(theme) => ({
                                fontSize: 'inherit',
                                color: 'primary.main',
                                ...theme.applyStyles('dark', {
                                    color: 'primary.light',
                                }),
                            })}
                        >
                            labels
                        </Typography>
                        &nbsp;and&nbsp;more
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            width: { sm: '100%', md: '80%' },
                        }}
                    >
                        Enjoy free digital proofs, quick production, and complimentary free shipping.
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
                            color: '#1976d2',
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                transform: 'scale(1.05)',
                            },
                        }}
                        disabled={!randomProductType}
                        onClick={() => {
                            if (randomProductType) {
                                router.push(`/custom-products/${randomProductType.id}`);
                            }
                        }}
                    >
                        Shop {randomProductType?.name || 'Stickers'}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
