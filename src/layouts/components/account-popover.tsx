import {useState, useEffect, useCallback} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import MenuItem, {menuItemClasses} from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';

import {useRouter, usePathname} from 'src/routes/hooks';

import {logoutSession, getCurrentUser} from "../../api";
import type {ButtonProps} from '@mui/material/Button';

// ----------------------------------------------------------------------

export type AccountPopoverProps = ButtonProps & {
    data?: {
        label: string;
        href: string;
        icon?: React.ReactNode;
        info?: React.ReactNode;
    }[];
};

export function AccountPopover({data = [], sx, ...other}: AccountPopoverProps) {
    const router = useRouter();

    const pathname = usePathname();

    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const [user, setUser] = useState(getCurrentUser);

    useEffect(() => {
        const refresh = () => setUser(getCurrentUser());
        window.addEventListener('current-user-updated', refresh);
        return () => window.removeEventListener('current-user-updated', refresh);
    }, []);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
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
        void logoutSession().finally(() => router.push('/sign-in'));
    }, [router]);

    return (
        <>
            <Button
                onClick={handleOpenPopover}
                sx={{
                    px: 2,
                    height: 40,
                    backgroundColor: 'primary.main',
                    color: 'common.white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                    ...sx,
                }}
                {...other}
            >
                <PersonIcon fontSize="small"/>
                {user?.person.firstName ?? 'User'}
                <KeyboardArrowDownIcon fontSize="small"/>
            </Button>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                slotProps={{
                    paper: {
                        sx: {width: 200},
                    },
                }}
            >
                <Box sx={{p: 2, pb: 1.5}}>
                    <Typography variant="subtitle2" noWrap>
                        {user?.person.firstName ?? ''} {user?.person.lastName ?? ''}
                    </Typography>

                    <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                        {user?.username ?? ''}
                    </Typography>
                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <MenuList
                    disablePadding
                    sx={{
                        p: 1,
                        gap: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            color: 'text.secondary',
                            '&:hover': {color: 'text.primary'},
                            [`&.${menuItemClasses.selected}`]: {
                                color: 'text.primary',
                                bgcolor: 'action.selected',
                                fontWeight: 'fontWeightSemiBold',
                            },
                        },
                    }}
                >
                    {data.map((option) => (
                        <MenuItem
                            key={option.label}
                            selected={option.href === pathname}
                            onClick={() => handleClickItem(option.href)}
                        >
                            {option.icon}
                            {option.label}
                        </MenuItem>
                    ))}
                </MenuList>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Box sx={{p: 1}}>
                    <Button fullWidth color="error" size="medium" variant="text" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Popover>
        </>
    );
}
