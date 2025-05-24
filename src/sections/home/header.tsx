import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem, {menuItemClasses} from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
import {getCurrentUser, logout} from "../../api";
import Avatar from "@mui/material/Avatar";
import {useCallback, useEffect, useState} from "react";
import {useRouter} from "../../routes/hooks";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import {getActiveProductTypes, ProductType} from "../../api/productType";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Iconify} from "../../components/iconify";
import Badge from '@mui/material/Badge';
import {useCart} from "./create-order/cart/cart-context";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    backdropFilter: 'blur(24px)',
    padding: '15px 12px',
}));

export default function Header() {
    const user = getCurrentUser();
    const router = useRouter();
    const { cartItems, setCartItems } = useCart();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const [open, setOpen] = React.useState(false);
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    useEffect(() => {
        loadProductTypes();
    }, []);

    const loadProductTypes = async () => {
        const data = await getActiveProductTypes();
        setProductTypes(data);
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenPopover = useCallback((event: any) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleClickItem = useCallback(
        (path: string) => {
            handleClosePopover();
            router.push(path);
        },
        [handleClosePopover, router]
    );

    const handleLogout = useCallback(() => {
        logout();
        router.push('/sign-in');
    }, [router]);

    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
        <Container>
            <StyledToolbar variant="dense">
                <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', px: 0}}>
                    <Box
                        component="a"
                        href="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'none' },
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/images/brands/logo.webp"
                            alt="Logo"
                            sx={{
                                height: 40,
                                width: 40,
                                mr: 1.5,
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease',
                                boxShadow: 1,
                                '&:hover': { transform: 'scale(1.1)' },
                            }}
                        />
                    </Box>
                    <Box sx={{display: {xs: 'none', md: 'flex'}, gap: 2, ml: 2}}>
                        <Button
                            size="medium"
                            sx={{color: 'text.primary', fontWeight: 500}}
                            onClick={handleOpenMenu}
                            endIcon={<ArrowDropDownIcon/>}
                        >
                            Products
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleCloseMenu}
                            MenuListProps={{'aria-labelledby': 'products-button'}}
                        >
                            {productTypes.map((type) => (
                                <MenuItem
                                    key={type.id}
                                    onClick={() => {
                                        handleCloseMenu();
                                        router.push(`/custom-products/${type.id}`);
                                    }}
                                >
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Menu>

                        <Button size="medium" sx={{color: 'text.primary', fontWeight: 500}}>
                            For Businesses
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: {xs: 'none', md: 'flex'},
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <IconButton
                        onClick={() => router.push('/cart')}
                        disabled={cartItems.length === 0}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        <Badge badgeContent={cartItems.length} color="warning" sx={{mr: 2}}>
                            <ShoppingCartIcon/>
                        </Badge>
                    </IconButton>
                    {user ? (
                        user.role === 'ROLE_ADMIN' ? (
                            <Button
                                onClick={() => router.push('/dashboard')}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    color: 'text.primary',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        ) : (
                            <Button
                                onClick={handleOpenPopover}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    color: 'text.primary',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                                endIcon={<ArrowDropDownIcon />}
                            >
                                {user?.person?.firstName}
                            </Button>
                        )
                    ) : (
                        <>
                        <Button color="primary" variant="text" size="medium" href="/sign-in"
                                sx={{ border: '1px solid', borderColor: 'primary.main' }} >
                            Log in
                        </Button>
                        <Button color="primary" variant="text" size="medium" href="/sign-up"
                                sx={{ border: '1px solid', borderColor: 'primary.main' }} >
                            Sign up
                        </Button>
                        </>
                    )}
                </Box>
                <Box sx={{display: {xs: 'flex', md: 'none'}, gap: 1}}>
                    <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Drawer
                        anchor="top"
                        open={open}
                        onClose={toggleDrawer(false)}
                        PaperProps={{
                            sx: {
                                top: 'var(--template-frame-height, 0px)',
                            },
                        }}
                    >
                        <Box sx={{p: 2, backgroundColor: 'background.default'}}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <IconButton onClick={toggleDrawer(false)}>
                                    <CloseRoundedIcon/>
                                </IconButton>
                            </Box>

                            <MenuItem>Products</MenuItem>
                            <MenuItem>For Businesses</MenuItem>
                            {user ? (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ px: 2, pb: 2 }}>
                                        <Typography variant="subtitle2" noWrap>
                                            {user.person.firstName} {user.person.lastName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                            {user.username}
                                        </Typography>
                                    </Box>
                                    <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                                    <MenuItem onClick={() => router.push('/my-orders')}>My Orders</MenuItem>
                                    <Divider sx={{ my: 2 }} />
                                    <MenuItem>
                                        <Button color="error" fullWidth onClick={handleLogout}>
                                            Logout
                                        </Button>
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem>
                                    <Button color="primary" variant="outlined" fullWidth href="/sign-in">
                                        Sign in
                                    </Button>
                                    <Button color="primary" variant="outlined" fullWidth href="/sign-up">
                                        Sign up
                                    </Button>
                                </MenuItem>
                            )}
                        </Box>
                    </Drawer>
                </Box>
                <Popover
                    open={Boolean(openPopover)}
                    anchorEl={openPopover}
                    onClose={handleClosePopover}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slotProps={{
                        paper: {
                            sx: { width: 220, mt: 1.5, p: 0 },
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" noWrap>
                            {user?.person?.firstName} {user?.person?.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
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
                                borderRadius: 0.75,
                                fontWeight: 500,
                                '&:hover': { bgcolor: 'action.hover' },
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleClickItem('/profile')}>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => handleClickItem('/my-orders')}>
                            My Orders
                        </MenuItem>
                    </MenuList>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    <Box sx={{ p: 1 }}>
                        <Button fullWidth color="error" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Popover>
            </StyledToolbar>
        </Container>
        </Box>
    );
}