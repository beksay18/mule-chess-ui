import { useEffect, useState } from 'react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { alpha, useTheme } from '@mui/material/styles';
import { Scrollbar } from 'src/components/scrollbar';

const BRAND_BLUE = '#175195';

export type StatusFilter = 'all' | 'active' | 'inactive';
export type RoleFilter = 'all' | 'admin' | 'customer';
export type ProviderFilter = 'all' | 'google' | 'email';

export type UserFiltersState = {
    status: StatusFilter;
    role: RoleFilter;
    provider: ProviderFilter;
};

export const DEFAULT_USER_FILTERS: UserFiltersState = {
    status: 'all',
    role: 'all',
    provider: 'all',
};

type FilterOption<T extends string> = {
    value: T;
    label: string;
};

const STATUS_OPTIONS: FilterOption<StatusFilter>[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const ROLE_OPTIONS: FilterOption<RoleFilter>[] = [
    { value: 'all', label: 'All roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'customer', label: 'Customer' },
];

const PROVIDER_OPTIONS: FilterOption<ProviderFilter>[] = [
    { value: 'all', label: 'All sign-in' },
    { value: 'google', label: 'Google' },
    { value: 'email', label: 'Email' },
];

export function hasActiveUserFilters(filters: UserFiltersState) {
    return filters.status !== 'all' || filters.role !== 'all' || filters.provider !== 'all';
}

type FilterGroupProps<T extends string> = {
    label: string;
    options: FilterOption<T>[];
    value: T;
    onChange: (value: T) => void;
    chipSx: (isActive: boolean) => object;
};

function FilterGroup<T extends string>({
    label,
    options,
    value,
    onChange,
    chipSx,
}: FilterGroupProps<T>) {
    return (
        <Stack spacing={1}>
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: alpha(BRAND_BLUE, 0.7),
                }}
            >
                {label}
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {options.map((option) => (
                    <Chip
                        key={option.value}
                        label={option.label}
                        clickable
                        onClick={() => onChange(option.value)}
                        sx={chipSx(value === option.value)}
                    />
                ))}
            </Stack>
        </Stack>
    );
}

type UserFiltersProps = {
    filters: UserFiltersState;
    totalUsers: number;
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onApply: (filters: UserFiltersState) => void;
    onReset: () => void;
};

export function UserFilters({
    filters,
    totalUsers,
    open,
    onOpen,
    onClose,
    onApply,
    onReset,
}: UserFiltersProps) {
    const theme = useTheme();
    const [tempFilters, setTempFilters] = useState<UserFiltersState>(filters);
    const canReset = hasActiveUserFilters(filters);

    useEffect(() => {
        if (open) {
            setTempFilters(filters);
        }
    }, [open, filters]);

    const filterChipSx = (isActive: boolean) => ({
        fontWeight: 600,
        fontSize: '0.8125rem',
        height: 32,
        borderRadius: 50,
        bgcolor: isActive ? BRAND_BLUE : '#ffffff',
        color: isActive ? '#ffffff' : theme.palette.grey[700],
        border: `1px solid ${isActive ? BRAND_BLUE : alpha(BRAND_BLUE, 0.2)}`,
        '&:hover': {
            bgcolor: isActive ? '#124578' : alpha(BRAND_BLUE, 0.06),
        },
    });

    const handleApply = () => {
        onApply(tempFilters);
        onClose();
    };

    const handleReset = () => {
        setTempFilters(DEFAULT_USER_FILTERS);
        onReset();
        onClose();
    };

    const userCountLabel =
        totalUsers === 1 ? '1 user' : `${totalUsers} users`;

    return (
        <>
            <Button
                onClick={onOpen}
                startIcon={
                    <Badge color="error" variant="dot" invisible={!canReset}>
                        <FilterListIcon />
                    </Badge>
                }
                sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    color: BRAND_BLUE,
                    bgcolor: alpha(BRAND_BLUE, 0.06),
                    border: `1px solid ${alpha(BRAND_BLUE, 0.18)}`,
                    borderRadius: 50,
                    px: 2,
                    py: 0.75,
                    '&:hover': {
                        bgcolor: alpha(BRAND_BLUE, 0.1),
                        borderColor: alpha(BRAND_BLUE, 0.3),
                    },
                }}
            >
                {userCountLabel}
            </Button>

            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                slotProps={{
                    paper: {
                        sx: { width: { xs: '100%', sm: 380 }, overflow: 'hidden' },
                    },
                }}
            >
                <Box
                    sx={{
                        py: 2,
                        px: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography sx={{ flexGrow: 1, fontWeight: 700, fontSize: '1.125rem' }}>
                        Filters
                    </Typography>
                    <IconButton
                        onClick={handleReset}
                        aria-label="Reset filters"
                        sx={{ color: canReset ? BRAND_BLUE : 'text.disabled' }}
                    >
                        <Badge color="error" variant="dot" invisible={!canReset}>
                            <RestartAltIcon />
                        </Badge>
                    </IconButton>
                    <IconButton onClick={onClose} aria-label="Close filters">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                <Scrollbar>
                    <Stack spacing={3} sx={{ p: 2.5 }}>
                        <FilterGroup
                            label="Status"
                            options={STATUS_OPTIONS}
                            value={tempFilters.status}
                            onChange={(value) =>
                                setTempFilters((prev) => ({ ...prev, status: value }))
                            }
                            chipSx={filterChipSx}
                        />

                        <FilterGroup
                            label="Role"
                            options={ROLE_OPTIONS}
                            value={tempFilters.role}
                            onChange={(value) =>
                                setTempFilters((prev) => ({ ...prev, role: value }))
                            }
                            chipSx={filterChipSx}
                        />

                        <FilterGroup
                            label="Sign-in"
                            options={PROVIDER_OPTIONS}
                            value={tempFilters.provider}
                            onChange={(value) =>
                                setTempFilters((prev) => ({ ...prev, provider: value }))
                            }
                            chipSx={filterChipSx}
                        />
                    </Stack>
                </Scrollbar>

                <Box
                    sx={{
                        p: 2.5,
                        borderTop: `1px solid ${theme.palette.grey[200]}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleApply}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            py: 1.25,
                            bgcolor: BRAND_BLUE,
                            '&:hover': { bgcolor: '#124578' },
                        }}
                    >
                        Apply filters
                    </Button>
                    {canReset && (
                        <Button
                            fullWidth
                            onClick={handleReset}
                            sx={{ textTransform: 'none', fontWeight: 600, color: BRAND_BLUE }}
                        >
                            Clear all
                        </Button>
                    )}
                </Box>
            </Drawer>
        </>
    );
}
