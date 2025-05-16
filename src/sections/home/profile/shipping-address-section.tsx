import * as React from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Card,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, Select, FormControl, InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    getShippingAddresses,
    createOrUpdateShippingAddress,
    deleteShippingAddress,
    ShippingAddressResponse,
    ShippingAddressRequest,
} from '../../../api/shippingAddress';
import MenuItem from "@mui/material/MenuItem";
import {usStates} from "../../../api/order";

interface ShippingAddressSectionProps {
    userId: number;
}

export default function ShippingAddressSection({ userId }: ShippingAddressSectionProps) {
    const [addressList, setAddressList] = React.useState<ShippingAddressResponse[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [editOpen, setEditOpen] = React.useState(false);
    const [selectedAddress, setSelectedAddress] = React.useState<ShippingAddressResponse | null>(null);
    const [formSubmitted, setFormSubmitted] = React.useState(false);

    const [form, setForm] = React.useState<ShippingAddressRequest>({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        isDefault: true,
    });

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

    React.useEffect(() => {
        fetchAddresses();
    }, [userId]);

    const handleEdit = (address: ShippingAddressResponse) => {
        setForm(address);
        setSelectedAddress(address);
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

        const hasEmpty = requiredFields.some(
            (field) => !payload[field]?.toString().trim()
        );

        if (hasEmpty) {
            alert('Please fill all required fields.');
            return;
        }

        await createOrUpdateShippingAddress(userId, payload);
        setEditOpen(false);
        await fetchAddresses();
    };

    return (
        <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Shipping Addresses</Typography>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        setForm({
                            addressLine1: '',
                            addressLine2: '',
                            city: '',
                            state: '',
                            postalCode: '',
                            country: 'United States',
                            isDefault: true,
                        });
                        setSelectedAddress(null);
                        setEditOpen(true);
                    }}
                >
                    Add Address
                </Button>
            </Box>

            {loading ? (
                <CircularProgress size={24} />
            ) : addressList.length > 0 ? (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                    }}
                >
                    {addressList.map((addr) => (
                        <Card
                            key={addr.id}
                            variant="outlined"
                            sx={{
                                p: 2,
                                position: 'relative',
                                borderRadius: 2,
                                boxShadow: 1,
                                backgroundColor: addr.isDefault ? '#f9fcff' : '#fff',
                                border: addr.isDefault ? '2px solid #1976d2' : '1px solid #ccc',
                                transition: '0.3s',
                                '&:hover': { boxShadow: 4 },
                            }}
                        >
                            {addr.isDefault && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: '#e3f2fd',
                                        color: '#1976d2',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    DEFAULT ADDRESS
                                </Box>
                            )}

                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {addr.addressLine1}
                                </Typography>
                                {addr.addressLine2 && (
                                    <Typography variant="body2" color="text.secondary">
                                        {addr.addressLine2}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    {addr.city}, {addr.state} {addr.postalCode}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {addr.country}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEdit(addr)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(addr)}
                                >
                                    Delete
                                </Button>
                                {!addr.isDefault && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() =>
                                            handleEditSave({ ...addr, isDefault: true })
                                        }
                                    >
                                        Make Default
                                    </Button>
                                )}
                            </Box>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography>No shipping addresses found.</Typography>
            )}

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{selectedAddress ? 'Edit Address' : 'Add Address'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {['addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'].map((field) => {
                            const isRequired = field !== 'addressLine2' && field !== 'country';
                            const showError =
                                isRequired &&
                                formSubmitted &&
                                !form[field as keyof ShippingAddressRequest]?.toString().trim();

                            if (field === 'state') {
                                return (
                                    <FormControl fullWidth required error={showError}>
                                        <InputLabel id="state-label">State</InputLabel>
                                        <Select
                                            labelId="state-label"
                                            id="state"
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
                                    label={field === 'country' ? 'Country (Fixed)' : field}
                                    fullWidth
                                    required={isRequired}
                                    variant="outlined"
                                    value={(form as any)[field]}
                                    disabled={field === 'country'}
                                    error={showError}
                                    helperText={
                                        field === 'country'
                                            ? 'Country is fixed to United States'
                                            : showError
                                                ? `${field} is required`
                                                : ''
                                    }
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            [field]: e.target.value,
                                        }))
                                    }
                                />
                            );
                        })}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleEditSave()}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
