import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from "../../routes/hooks";
import { useEffect, useState } from "react";
import { getActiveProductTypes, ProductType } from "../../api/productType";

export default function HomeOverview() {
    const [randomProductType, setRandomProductType] = useState<ProductType | null>(null);
    const router = useRouter();

    const headerImage = '/assets/images/hello.png';

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
            sx={{
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pt: { xs: 4, sm: 2 },
                    pb: { xs: 4, sm: 2 },
                }}
            >
                <Box sx={{ width: { xs: '100%', md: '50%' }, pr: { md: 4 } }}>
                    <Stack spacing={2} useFlexGap>
                        <Typography
                            variant="h3"
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
                                variant="h3"
                                sx={(theme) => ({
                                    fontSize: 'inherit',
                                    color: 'primary.main',
                                    ...theme.applyStyles?.('dark', {
                                        color: 'primary.light',
                                    }),
                                })}
                            >
                                stickers,&nbsp;
                            </Typography>
                            <Typography
                                component="span"
                                variant="h3"
                                sx={(theme) => ({
                                    fontSize: 'inherit',
                                    color: 'primary.main',
                                    ...theme.applyStyles?.('dark', {
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
                                textAlign: 'left',
                                color: 'text.secondary',
                                width: { sm: '100%', md: '90%' },
                            }}
                        >
                            Enjoy free digital proofs, quick production, and complimentary free shipping.
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Button
                                sx={{
                                    width: 'auto',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    borderRadius: 2,
                                    backgroundColor: '#1469d7',
                                    color: '#ffffff',
                                    textTransform: 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
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

                            <Button
                                sx={{
                                    width: 'auto',
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
                            >
                                Get Samples
                            </Button>
                        </Stack>

                    </Stack>
                </Box>

                <Box
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        mt: { xs: 4, md: 0 },
                        textAlign: 'center',
                    }}
                >
                    <Box
                        component="img"
                        src={headerImage}
                        alt="Header"
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            height: 'auto',
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
