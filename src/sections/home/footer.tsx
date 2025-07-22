import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import {useEffect, useState} from "react";
import {getActiveProductTypes, ProductType} from "../../api/productType";
import {useRouter} from "../../routes/hooks";

function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            {'Copyright © '}
            <Link color="text.secondary" href="#">
                SAKAI
            </Link>
            &nbsp;
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadProductTypes();
    }, []);

    const loadProductTypes = async () => {
        const data = await getActiveProductTypes();
        setProductTypes(data);
    };

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 4, sm: 8 },
                py: { xs: 8, sm: 10 },
                textAlign: { sm: 'center', md: 'left' },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        minWidth: { xs: '100%', sm: '60%' },
                    }}
                >
                    <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
                        <Stack direction="row" spacing={1}>
                            <IconButton href="#" size="large" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                                <InstagramIcon fontSize="large" />
                            </IconButton>
                            <IconButton href="#" size="large" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                                <YouTubeIcon fontSize="large" />
                            </IconButton>
                            <IconButton href="#" size="large" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                                <FacebookIcon fontSize="large" />
                            </IconButton>
                        </Stack>
                        <Typography variant="body2" gutterBottom color="text.secondary" sx={{ fontWeight: 600, mt: 2 }}>
                            © {new Date().getFullYear()} SAKAI. All rights reserved.&nbsp;
                            <Link href="/privacy" underline="hover" color="text.secondary" sx={{ ml: 1 }}>
                                Privacy
                            </Link>
                            <Typography component="span" sx={{ mx: 0.5 }} variant="caption">·</Typography>
                            <Link href="/terms" underline="hover" color="text.secondary">
                                Terms
                            </Link>
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Product
                    </Typography>
                    {productTypes.map((type) => (
                        <Link
                            key={type.id}
                            color="text.secondary"
                            variant="body2"
                            underline="hover"
                            onClick={() => {
                                router.push(`/custom-products/${type.id}`);
                            }}
                        >
                            {type.name}
                        </Link>
                    ))}
                </Box>
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Company
                    </Typography>
                    <Link color="text.secondary" variant="body2" href="/about-us">
                        About us
                    </Link>
                    <Link color="text.secondary" variant="body2" href="/blog">
                        Blog
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Support
                    </Typography>
                    <Link color="text.secondary" variant="body2" href="/help">
                        Help
                    </Link>
                    <Link color="text.secondary" variant="body2" href="/returns">
                        Returns
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}
