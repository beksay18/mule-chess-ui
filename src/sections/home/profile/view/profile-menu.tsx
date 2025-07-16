import Container from "@mui/material/Container";
import { Box, Stack, Button } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const menuItems = [
    { label: "Profile", path: "/profile" },
    { label: "My Orders", path: "/my-orders" },
    { label: "Shipping Addresses", path: "/my-shipping-addresses" }
];

export function ProfileMenu() {
    const location = useLocation();

    return (
        <Box
            sx={{
                backgroundColor: "#f4f4f4",
                borderBottom: "1px solid #ddd",
                py: 2,
            }}
        >
            <Container>
                <Stack direction="row" spacing={4} justifyContent="center">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Button
                                key={item.path}
                                component={NavLink}
                                to={item.path}
                                sx={{
                                    color: isActive ? 'primary.main' : 'text.primary',
                                    borderBottom: isActive ? '2px solid' : '2px solid transparent',
                                    borderColor: isActive ? 'primary.main' : 'transparent',
                                    borderRadius: 0,
                                    fontWeight: isActive ? 600 : 400,
                                    transition: 'border-color 0.2s, color 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        );
                    })}
                </Stack>
            </Container>
        </Box>
    );
}
