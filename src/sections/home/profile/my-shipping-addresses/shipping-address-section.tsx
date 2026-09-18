import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import {
    createOrUpdateShippingAddress,
    deleteShippingAddress,
    getShippingAddresses,
    ShippingAddressRequest,
    ShippingAddressResponse,
} from '../../../../api/shippingAddress';
import { usStates } from '../../../../api/order';

const BRAND_BLUE = '#175195';

const emptyForm: ShippingAddressRequest = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: true,
};

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(BRAND_BLUE, 0.4),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND_BLUE,
        },
    },
};

interface ShippingAddressSectionProps {
    userId: number;
}

export default function ShippingAddressSection({ userId }: ShippingAddressSectionProps) {
    const theme = useTheme();
    const [addressList, setAddressList] = useState<ShippingAddressResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<ShippingAddressResponse | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [form, setForm] = useState<ShippingAddressRequest>(emptyForm);

    const fetchAddresses = async () => {
        try {
            const addresses = await getShippingAddresses(userId);
            setAddressList(addresses);
        } catch (err) {
            console.error('Failed to fetch addresses', err);
            setAddressList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [userId]);

    const openAddDialog = () => {
        setForm(emptyForm);
        setSelectedAddress(null);
        setFormSubmitted(false);
        setEditOpen(true);
    };

    const handleEdit = (address: ShippingAddressResponse) => {
        setForm(address);
        setSelectedAddress(address);
        setFormSubmitted(false);
        setEditOpen(true);
    };

    const handleDelete = async (address: ShippingAddressResponse) => {
        await deleteShippingAddress(userId, address.id);
        await fetchAddresses();
    };

    const handleEditSave = async (custom?: ShippingAddressRequest) => {
        setFormSubmitted(true);
        const payload = custom ?? form;

        const requiredFields: (keyof ShippingAddressRequest)[] = [
            'addressLine1',
            'city',
            'state',
            'postalCode',
            'country',
        ];

        const hasEmpty = requiredFields.some((field) => !payload[field]?.toString().trim());

        if (hasEmpty) {
            return;
        }

        await createOrUpdateShippingAddress(userId, payload);
        setEditOpen(false);
        setFormSubmitted(false);
        await fetchAddresses();
    };

    const formatAddress = (addr: ShippingAddressResponse) => {
        const lines = [
            addr.addressLine1,
            addr.addressLine2,
            `${addr.city}, ${addr.state} ${addr.postalCode}`,
            addr.country,
        ].filter(Boolean);
        return lines;
    };

    return (
        <Stack spacing={3} sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.375rem', md: '1.5rem' },
                            letterSpacing: '-0.02em',
                            color: theme.palette.grey[900],
                            mb: 0.5,
                        }}
                    >
                        Shipping addresses
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                        Manage where your sticker orders are delivered.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openAddDialog}
                    sx={{
                        flexShrink: 0,
                        px: 2.5,
                        py: 1,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        borderRadius: 50,
                        bgcolor: BRAND_BLUE,
                        textTransform: 'none',
                        boxShadow: `0 4px 16px ${alpha(BRAND_BLUE, 0.25)}`,
                        '&:hover': { bgcolor: '#124578' },
                    }}
                >
                    Add address
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: BRAND_BLUE }} />
                </Box>
            ) : addressList.length > 0 ? (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 2,
                    }}
                >
                    {addressList.map((addr) => (
                        <Box
                            key={addr.id}
                            sx={{
                                p: 2.5,
                                borderRadius: 2.5,
                                border: `1px solid ${
                                    addr.isDefault ? alpha(BRAND_BLUE, 0.35) : theme.palette.grey[200]
                                }`,
                                bgcolor: addr.isDefault ? alpha(BRAND_BLUE, 0.03) : '#ffffff',
                                transition: 'box-shadow 0.2s ease',
                                '&:hover': {
                                    boxShadow: `0 4px 20px ${alpha(BRAND_BLUE, 0.08)}`,
                                },
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        bgcolor: alpha(BRAND_BLUE, 0.08),
                                        color: BRAND_BLUE,
                                    }}
                                >
                                    <PlaceOutlinedIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ mb: 0.75 }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.9375rem',
                                                color: theme.palette.grey[900],
                                            }}
                                        >
                                            {addr.addressLine1}
                                        </Typography>
                                        {addr.isDefault && (
                                            <Chip
                                                label="Default"
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontWeight: 700,
                                                    fontSize: '0.6875rem',
                                                    bgcolor: alpha(BRAND_BLUE, 0.12),
                                                    color: BRAND_BLUE,
                                                }}
                                            />
                                        )}
                                    </Stack>
                                    {formatAddress(addr).slice(1).map((line) => (
                                        <Typography
                                            key={line}
                                            variant="body2"
                                            sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                                        >
                                            {line}
                                        </Typography>
                                    ))}
                                </Box>
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                                sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${theme.palette.grey[100]}` }}
                            >
                                <IconButton
                                    size="small"
                                    aria-label="Edit address"
                                    onClick={() => handleEdit(addr)}
                                    sx={{ color: BRAND_BLUE }}
                                >
                                    <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    aria-label="Delete address"
                                    onClick={() => handleDelete(addr)}
                                    sx={{ color: theme.palette.error.main }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                                {!addr.isDefault && (
                                    <Button
                                        size="small"
                                        onClick={() => handleEditSave({ ...addr, isDefault: true })}
                                        sx={{
                                            ml: 'auto',
                                            fontWeight: 600,
                                            fontSize: '0.8125rem',
                                            color: BRAND_BLUE,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Set as default
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                    <LocalShippingOutlinedIcon
                        sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.25), mb: 1.5 }}
                    />
                    <Typography sx={{ fontWeight: 600, color: theme.palette.grey[700], mb: 0.5 }}>
                        No addresses saved
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Add a shipping address for faster checkout.
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={openAddDialog}
                        sx={{
                            borderColor: alpha(BRAND_BLUE, 0.35),
                            color: BRAND_BLUE,
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 50,
                            '&:hover': {
                                borderColor: BRAND_BLUE,
                                bgcolor: alpha(BRAND_BLUE, 0.04),
                            },
                        }}
                    >
                        Add your first address
                    </Button>
                </Box>
            )}

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {selectedAddress ? 'Edit address' : 'Add address'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {(['addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'] as const).map(
                            (field) => {
                                const isRequired = field !== 'addressLine2' && field !== 'country';
                                const showError =
                                    isRequired &&
                                    formSubmitted &&
                                    !form[field]?.toString().trim();

                                const labels: Record<string, string> = {
                                    addressLine1: 'Address line 1',
                                    addressLine2: 'Address line 2 (optional)',
                                    city: 'City',
                                    state: 'State',
                                    postalCode: 'ZIP code',
                                    country: 'Country',
                                };

                                if (field === 'state') {
                                    return (
                                        <FormControl
                                            key={field}
                                            fullWidth
                                            required
                                            error={showError}
                                            sx={fieldSx}
                                        >
                                            <InputLabel id="state-label">State</InputLabel>
                                            <Select
                                                labelId="state-label"
                                                value={form.state}
                                                label="State"
                                                onChange={(e) =>
                                                    setForm((prev) => ({ ...prev, state: e.target.value }))
                                                }
                                            >
                                                {usStates.map((state) => (
                                                    <MenuItem key={state} value={state}>
                                                        {state}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    );
                                }

                                return (
                                    <TextField
                                        key={field}
                                        label={labels[field]}
                                        fullWidth
                                        required={isRequired}
                                        value={form[field]}
                                        disabled={field === 'country'}
                                        error={showError}
                                        helperText={
                                            field === 'country'
                                                ? 'United States only'
                                                : showError
                                                  ? 'Required'
                                                  : ''
                                        }
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, [field]: e.target.value }))
                                        }
                                        sx={fieldSx}
                                    />
                                );
                            }
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleEditSave()}
                        sx={{
                            bgcolor: BRAND_BLUE,
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 50,
                            px: 3,
                            '&:hover': { bgcolor: '#124578' },
                        }}
                    >
                        Save address
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
