import { useState } from 'react';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import type { Product } from 'src/api/product';

import { BRAND_BLUE } from '../constants';

type StickerTypeTitleProps = {
    products: Product[];
    product: Product | null;
    onProductChange: (product: Product) => void;
};

export function StickerTypeTitle({ products, product, onProductChange }: StickerTypeTitleProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const label = product?.name || 'Sticker type';

    return (
        <>
            <Button
                disableRipple
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Sticker type: ${label}`}
                onClick={(event) => setAnchorEl(event.currentTarget)}
                endIcon={
                    <KeyboardArrowDownRoundedIcon
                        sx={{
                            fontSize: 20,
                            color: BRAND_BLUE,
                            transform: open ? 'rotate(180deg)' : 'none',
                            transition: 'transform 160ms ease',
                        }}
                    />
                }
                sx={{
                    minWidth: 0,
                    maxWidth: { xs: 260, sm: 480 },
                    px: 1.75,
                    py: 0.65,
                    borderRadius: 999,
                    textTransform: 'none',
                    color: BRAND_BLUE,
                    bgcolor: alpha(BRAND_BLUE, 0.08),
                    border: `1px solid ${alpha(BRAND_BLUE, 0.18)}`,
                    boxShadow: open ? `0 0 0 3px ${alpha(BRAND_BLUE, 0.12)}` : 'none',
                    '&:hover': {
                        bgcolor: alpha(BRAND_BLUE, 0.14),
                        borderColor: alpha(BRAND_BLUE, 0.28),
                    },
                    '& .MuiButton-endIcon': { ml: 0.5 },
                }}
            >
                <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            flexShrink: 0,
                            fontWeight: 700,
                            letterSpacing: 0.4,
                            color: alpha(BRAND_BLUE, 0.72),
                            textTransform: 'uppercase',
                        }}
                    >
                        Sticker type
                    </Typography>
                    <Box sx={{ width: '1px', height: 16, bgcolor: alpha(BRAND_BLUE, 0.22), flexShrink: 0 }} />
                    <Typography fontWeight={800} noWrap sx={{ color: BRAND_BLUE, lineHeight: 1.25 }}>
                        {label}
                    </Typography>
                </Box>
            </Button>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            minWidth: 260,
                            borderRadius: 2,
                            border: `1px solid ${alpha(BRAND_BLUE, 0.1)}`,
                            boxShadow: '0 16px 40px rgba(23, 81, 149, 0.16)',
                        },
                    },
                }}
            >
                {products.map((item) => {
                    const selected = item.id === product?.id;
                    return (
                        <MenuItem
                            key={item.id}
                            selected={selected}
                            onClick={() => {
                                onProductChange(item);
                                setAnchorEl(null);
                            }}
                            sx={{
                                mx: 0.75,
                                my: 0.25,
                                borderRadius: 1.5,
                                fontWeight: selected ? 800 : 600,
                                color: selected ? BRAND_BLUE : 'text.primary',
                                bgcolor: selected ? alpha(BRAND_BLUE, 0.08) : 'transparent',
                                '&.Mui-selected': {
                                    bgcolor: alpha(BRAND_BLUE, 0.1),
                                    color: BRAND_BLUE,
                                },
                                '&.Mui-selected:hover, &:hover': {
                                    bgcolor: alpha(BRAND_BLUE, 0.14),
                                },
                            }}
                        >
                            {item.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
