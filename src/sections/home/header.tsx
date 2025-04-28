import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Container>
            <StyledToolbar variant="dense">
                <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', px: 0}}>
                    <Typography
                        component="a"
                        href="/"
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 1,
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {textDecoration: 'none', color: 'primary.dark'},
                        }}
                    >
                        CG Stickers
                    </Typography>
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
                            <MenuItem onClick={handleCloseMenu}>Stickers</MenuItem>
                            <MenuItem onClick={handleCloseMenu}>Banners</MenuItem>
                            <MenuItem onClick={handleCloseMenu}>Popular</MenuItem>
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
                    <Button color="primary" variant="text" size="medium" component="a"
                            href="/sign-in">
                        Sign in
                    </Button>
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
                            <Divider sx={{my: 3}}/>
                            <MenuItem>
                                <Button color="primary" variant="outlined" fullWidth>
                                    Sign in
                                </Button>
                            </MenuItem>
                        </Box>
                    </Drawer>
                </Box>
            </StyledToolbar>
        </Container>
    );
}
