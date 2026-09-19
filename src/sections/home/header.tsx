import { useCallback, useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Badge from '@mui/material/Badge';
import { getCurrentUser, logout } from '../../api';
import { useRouter } from '../../routes/hooks';
import { useCart } from './create-order/cart/cart-context';

const BRAND_BLUE = '#175195';

const navLinkSx = {
    color: 'text.primary',
    fontWeight: 600,
    fontSize: '0.9375rem',
    textTransform: 'none',
    px: 1.5,
    py: 1,
    borderRadius: 2,
    transition: 'all 0.2s ease',
    '&:hover': {
        bgcolor: alpha(BRAND_BLUE, 0.06),
        color: BRAND_BLUE,
    },
} as const;

export default function Header() {
    const user = getCurrentUser();
    const router = useRouter();
    const theme = useTheme();
    const { cartItems } = useCart();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userAnchor, setUserAnchor] = useState<HTMLButtonElement | null>(null);

    const logoImage = '/assets/images/home-products/cg-sticker-house.png';

    const handleNavigate = useCallback(
        (path: string) => {
            setDrawerOpen(false);
            setUserAnchor(null);
            router.push(path);
        },
        [router]
    );

    const handleLogout = useCallback(() => {
        logout();
        router.push('/sign-in');
    }, [router]);

    const scrollToProducts = () => {
        setDrawerOpen(false);
        if (window.location.pathname === '/') {
            document.getElementById('home-products')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push('/#home-products');
        }
    };

    return (
        <Box
            component="header"
            id="header"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: theme.zIndex.appBar,
                width: '100%',
                bgcolor: alpha(theme.palette.grey[100], 0.95),
                backgroundImage: `linear-gradient(180deg, ${alpha(BRAND_BLUE, 0.04)} 0%, ${alpha(theme.palette.grey[100], 0.95)} 100%)`,
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                boxShadow: `0 1px 8px ${alpha(BRAND_BLUE, 0.06)}`,
            }}
        >
            <Container maxWidth="lg">
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: { xs: 64, md: 72 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 4 }}>
                        <Box
                            component="a"
                            href="/"
                            aria-label="CG Stickers home"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                flexShrink: 0,
                                transition: 'opacity 0.2s ease',
                                '&:hover': { opacity: 0.88 },
                            }}
                        >
                            <Box
                                component="img"
                                src={logoImage}
                                alt="CG Stickers"
                                sx={{
                                    height: { xs: 44, sm: 50, md: 56 },
                                    width: 'auto',
                                    maxWidth: { xs: 160, sm: 200, md: 240 },
                                    objectFit: 'contain',
                                    display: 'block',
                                }}
                            />
                        </Box>

                        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button sx={navLinkSx} onClick={scrollToProducts}>
                                Shop Stickers
                            </Button>
                            <Button sx={navLinkSx} onClick={() => router.push('/sticker-builder')}>
                                Sticker Builder
                            </Button>

                            <Button sx={navLinkSx} onClick={() => router.push('/for-business')}>
                                For Businesses
                            </Button>
                        </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, md: 1 }}>
                        <IconButton
                            onClick={() => router.push('/cart')}
                            disabled={cartItems.length === 0}
                            aria-label="Shopping cart"
                            sx={{
                                color: theme.palette.grey[700],
                                '&:hover': { bgcolor: alpha(BRAND_BLUE, 0.06), color: BRAND_BLUE },
                                '&.Mui-disabled': { color: theme.palette.grey[400] },
                            }}
                        >
                            <Badge
                                badgeContent={cartItems.length}
                                color="warning"
                                sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.7rem' } }}
                            >
                                <ShoppingCartOutlinedIcon />
                            </Badge>
                        </IconButton>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ display: { xs: 'none', md: 'flex' } }}
                        >
                            {user ? (
                                user.role === 'ROLE_ADMIN' ? (
                                    <Button
                                        onClick={() => router.push('/dashboard')}
                                        variant="outlined"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: BRAND_BLUE,
                                            borderColor: alpha(BRAND_BLUE, 0.35),
                                            borderRadius: 2,
                                            px: 2.5,
                                            '&:hover': {
                                                borderColor: BRAND_BLUE,
                                                bgcolor: alpha(BRAND_BLUE, 0.04),
                                            },
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={(e) => setUserAnchor(e.currentTarget)}
                                        variant="outlined"
                                        endIcon={<ArrowDropDownIcon />}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: BRAND_BLUE,
                                            borderColor: alpha(BRAND_BLUE, 0.35),
                                            borderRadius: 2,
                                            px: 2.5,
                                            '&:hover': {
                                                borderColor: BRAND_BLUE,
                                                bgcolor: alpha(BRAND_BLUE, 0.04),
                                            },
                                        }}
                                    >
                                        {user?.person?.firstName}
                                    </Button>
                                )
                            ) : (
                                <>
                                    <Button
                                        href="/sign-in"
                                        sx={{
                                            ...navLinkSx,
                                            color: theme.palette.grey[700],
                                        }}
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        href="/sign-up"
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.9375rem',
                                            bgcolor: BRAND_BLUE,
                                            borderRadius: 2,
                                            px: 2.5,
                                            boxShadow: `0 4px 12px ${alpha(BRAND_BLUE, 0.25)}`,
                                            '&:hover': {
                                                bgcolor: '#124578',
                                                boxShadow: `0 6px 16px ${alpha(BRAND_BLUE, 0.35)}`,
                                            },
                                        }}
                                    >
                                        Sign up
                                    </Button>
                                </>
                            )}
                        </Stack>

                        <IconButton
                            aria-label="Open menu"
                            onClick={() => setDrawerOpen(true)}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                color: theme.palette.grey[800],
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </Container>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: { width: 300, p: 0 },
                }}
            >
                <Box sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography fontWeight={700} fontSize="1.1rem">
                            Menu
                        </Typography>
                        <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>

                    <MenuItem onClick={scrollToProducts} sx={{ borderRadius: 1.5, fontWeight: 500 }}>
                        Shop Stickers
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleNavigate('/sticker-builder')}
                        sx={{ borderRadius: 1.5, fontWeight: 500 }}
                    >
                        Sticker Builder
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleNavigate('/for-business')}
                        sx={{ borderRadius: 1.5, fontWeight: 500 }}
                    >
                        For Businesses
                    </MenuItem>

                    {user ? (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ px: 1, pb: 1 }}>
                                <Typography variant="subtitle2" fontWeight={700}>
                                    {user.person.firstName} {user.person.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {user.username}
                                </Typography>
                            </Box>
                            <MenuItem onClick={() => handleNavigate('/profile')}>Profile</MenuItem>
                            <MenuItem onClick={() => handleNavigate('/my-orders')}>My Orders</MenuItem>
                            <MenuItem onClick={() => handleNavigate('/my-designs')}>My Designs</MenuItem>
                            {user.role === 'ROLE_ADMIN' && (
                                <MenuItem onClick={() => handleNavigate('/dashboard')}>Dashboard</MenuItem>
                            )}
                            <Box sx={{ mt: 2 }}>
                                <Button fullWidth color="error" variant="outlined" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Stack spacing={1.5} sx={{ mt: 3 }}>
                            <Button
                                fullWidth
                                href="/sign-in"
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderColor: alpha(BRAND_BLUE, 0.35),
                                    color: BRAND_BLUE,
                                    borderRadius: 2,
                                }}
                            >
                                Log in
                            </Button>
                            <Button
                                fullWidth
                                href="/sign-up"
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: BRAND_BLUE,
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: '#124578' },
                                }}
                            >
                                Sign up
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Drawer>

            <Popover
                open={Boolean(userAnchor)}
                anchorEl={userAnchor}
                onClose={() => setUserAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 240,
                            mt: 1.5,
                            p: 0,
                            borderRadius: 2,
                            boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.12)}`,
                            border: `1px solid ${theme.palette.grey[200]}`,
                        },
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {user?.person?.firstName} {user?.person?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {user?.username}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuList
                    disablePadding
                    sx={{
                        p: 1,
                        gap: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1.5,
                            py: 1,
                            borderRadius: 1.5,
                            fontWeight: 500,
                            '&:hover': { bgcolor: alpha(BRAND_BLUE, 0.06) },
                        },
                    }}
                >
                    <MenuItem onClick={() => handleNavigate('/profile')}>Profile</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/my-orders')}>My Orders</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/my-designs')}>My Designs</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/my-shipping-addresses')}>
                        Shipping Addresses
                    </MenuItem>
                </MenuList>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 1 }}>
                    <Button fullWidth color="error" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
}
