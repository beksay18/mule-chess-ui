import * as React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    Container,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCurrentUser } from '../../../api';
import {
    getShippingAddresses,
    createOrUpdateShippingAddress,
    deleteShippingAddress,
    ShippingAddressResponse,
    ShippingAddressRequest,
} from '../../../api/shippingAddress';

export default function ProfilePage() {
    const user = getCurrentUser();

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
        country: '',
        isDefault: true
    });

    const fetchAddresses = async () => {
        if (!user?.userId) return;
        try {
            const addresses = await getShippingAddresses(user.userId);
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
    }, [user?.userId]);

    const handleEdit = (address: ShippingAddressResponse) => {
        setForm(address);
        setSelectedAddress(address);
        setEditOpen(true);
    };

    const handleDelete = async (address: ShippingAddressResponse) => {
        if (!user?.userId) return;
        console.log("Deleting address ID:", address.id);
        console.log("User id ID:", user.userId);
        await deleteShippingAddress(user.userId, address.id);
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

        if (!user?.userId) return;

        await createOrUpdateShippingAddress(user.userId, payload);
        setEditOpen(false);
        await fetchAddresses();
    };


    return (
        <Container sx={{ mt: 5 }}>
            <Box
                sx={{
                    mx: 'auto',
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    boxShadow: 3,
                }}
            >
                {/* Profile Header */}
                <Box
                    sx={{
                        backgroundImage: 'linear-gradient(135deg, #4469b4 0%, #96a6d2 100%)',
                        borderRadius: 3,
                        p: 4,
                        position: 'relative',
                        color: 'white',
                    }}
                >
                    <Avatar
                        src="/avatar-placeholder.png"
                        sx={{
                            width: 100,
                            height: 100,
                            border: '4px solid white',
                            position: 'absolute',
                            top: 24,
                            left: 24,
                        }}
                    />
                    <Box sx={{ ml: 16, pt: 3 }}>
                        <Typography variant="h5" fontWeight={700}>
                            {user?.person?.firstName} {user?.person?.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {user?.username}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{mx: 'auto', mt: 5 }}>
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
                                    country: '',
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
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                justifyContent: addressList.length === 1 ? 'center' : 'flex-start',
                            }}
                        >
                            {addressList.map((addr) => (
                                <Card
                                    key={addr.id}
                                    variant="outlined"
                                    sx={{
                                        flex: {
                                            xs: '100%',
                                            sm: 'calc(50% - 8px)',
                                        },
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        p: 2,
                                        backgroundColor: '#fdfdfd',
                                        transition: '0.2s',
                                        '&:hover': { boxShadow: 3 },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
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

                                            {addr.isDefault && (
                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                        display: 'inline-block',
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1976d2',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    DEFAULT
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Button size="small" variant="outlined" onClick={() => handleEdit(addr)} >
                                                <EditIcon fontSize="small" />
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(addr)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                            {!addr.isDefault && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        handleEditSave({ ...addr, isDefault: true });
                                                    }}
                                                >
                                                    Make Default
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No shipping addresses found.
                        </Typography>
                    )}
                </Box>
            </Box>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{selectedAddress ? 'Edit Address' : 'Add Address'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {['addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'].map((field) => {
                            const isRequired = field !== 'addressLine2';
                            const showError = isRequired && formSubmitted && !form[field as keyof ShippingAddressRequest]?.toString().trim();
                            return (
                                <TextField
                                    key={field}
                                    label={field}
                                    fullWidth
                                    required={isRequired}
                                    variant="outlined"
                                    value={(form as any)[field]}
                                    error={showError}
                                    helperText={showError ? `${field} is required` : ''}
                                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
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
        </Container>
    );
}
