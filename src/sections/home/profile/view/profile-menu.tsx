import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { NavLink, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../../../api';

const BRAND_BLUE = '#175195';

const menuItems = [
    {
        label: 'Profile',
        description: 'Name, email & password',
        path: '/profile',
        icon: PersonOutlineOutlinedIcon,
    },
    {
        label: 'My Orders',
        description: 'Track your sticker orders',
        path: '/my-orders',
        icon: ReceiptLongOutlinedIcon,
    },
    {
        label: 'Shipping',
        description: 'Saved delivery addresses',
        path: '/my-shipping-addresses',
        icon: LocalShippingOutlinedIcon,
    },
] as const;

export function ProfileMenu() {
    const theme = useTheme();
    const location = useLocation();
    const user = getCurrentUser();
    const firstName = user?.person?.firstName || 'there';

    return (
        <Box
            component="nav"
            sx={{
                position: { md: 'sticky' },
                top: { md: 24 },
                width: '100%',
            }}
        >
            <Box
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#ffffff',
                    border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                    boxShadow: `0 8px 32px ${alpha(BRAND_BLUE, 0.06)}`,
                }}
            >
                <Box
                    sx={{
                        px: 2.5,
                        py: 2.5,
                        bgcolor: alpha(BRAND_BLUE, 0.04),
                        borderBottom: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: '1.0625rem',
                            color: theme.palette.grey[900],
                            letterSpacing: '-0.02em',
                            mb: 0.25,
                        }}
                    >
                        Hi, {firstName}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.8125rem',
                            color: 'text.secondary',
                            wordBreak: 'break-word',
                        }}
                    >
                        {user?.username}
                    </Typography>
                </Box>

                <Stack spacing={0.5} sx={{ p: 1.25 }}>
                    {menuItems.map(({ label, description, path, icon: Icon }) => {
                        const isActive = location.pathname === path;

                        return (
                            <Box
                                key={path}
                                component={NavLink}
                                to={path}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 1.5,
                                    py: 1.25,
                                    borderRadius: 2.5,
                                    textDecoration: 'none',
                                    bgcolor: isActive ? alpha(BRAND_BLUE, 0.08) : 'transparent',
                                    transition: 'background-color 0.2s ease',
                                    '&:hover': {
                                        bgcolor: alpha(BRAND_BLUE, 0.06),
                                        '& .menu-chevron': { opacity: 1, transform: 'translateX(2px)' },
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        bgcolor: isActive ? BRAND_BLUE : alpha(BRAND_BLUE, 0.08),
                                        color: isActive ? '#ffffff' : BRAND_BLUE,
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <Icon sx={{ fontSize: 18 }} />
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: isActive ? 700 : 600,
                                            fontSize: '0.9375rem',
                                            color: isActive ? BRAND_BLUE : theme.palette.grey[900],
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            display: { xs: 'none', md: 'block' },
                                            fontSize: '0.75rem',
                                            color: 'text.secondary',
                                            lineHeight: 1.35,
                                            mt: 0.15,
                                        }}
                                    >
                                        {description}
                                    </Typography>
                                </Box>

                                <ChevronRightIcon
                                    className="menu-chevron"
                                    sx={{
                                        fontSize: 18,
                                        color: alpha(BRAND_BLUE, 0.45),
                                        opacity: isActive ? 1 : 0,
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0,
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Stack>
            </Box>
        </Box>
    );
}
