import {
    Box,
    Typography,
    Button, Snackbar, Alert,
} from '@mui/material';
import {DashboardContent} from 'src/layouts/dashboard';
import {useParams, useSearchParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {CustomerOrderResponse, getOrderById} from '../../../../api/orderDetails';
import {useRouter} from "../../../../routes/hooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {toast} from 'react-toastify';
import {createLabel, markOrderReadyToShip, startProcessingOrder} from "../../../../api/order";
import {OrderSummary} from "../order-summary";
import {CustomerInfo} from "../customer-info";
import {ShippingInfo} from "../shipping-info";
import {ProductList} from "../product-list";
import Dialog from "@mui/material/Dialog";

type OrderDetailProps = {
    setOrderStatus: (status: string) => void;
};

export function OrderDetailsView({setOrderStatus}: OrderDetailProps) {
    const router = useRouter();
    const {id} = useParams();
    const [order, setOrder] = useState<CustomerOrderResponse | null>(null);
    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';

    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || '0';
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'IN_PROGRESS' | 'READY_TO_SHIP' | 'SHIPPED' | null>(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (id) getOrderById(Number(id)).then(setOrder);
    }, [id]);

    const handleStartProcessing = async () => {
        if (!id) return;

        try {
            await startProcessingOrder(id);
            showSnackbar("Order marked as IN_PROGRESS.", 'success');

            const updated = await getOrderById(Number(id));
            setOrder(updated);
            setOrderStatus(updated.orderStatus);
        } catch (error: any) {
            showSnackbar(error?.response?.data?.message || "Failed to start processing.", 'error');
        }
    };

    const handleReadyToShip = async () => {
        if (!id) return;

        try {
            await markOrderReadyToShip(id);
            showSnackbar("Order marked as READY_TO_SHIP.", 'success');

            const updated = await getOrderById(Number(id));
            setOrder(updated);
            setOrderStatus(updated.orderStatus);
        } catch (error: any) {
            showSnackbar(error?.response?.data?.message || "Failed to mark ready to ship.", 'error');
        }
    };

    const handleCreateLabel = async () => {
        if (!id) return;

        try {
            await createLabel(id);
            showSnackbar("Label Created", 'success');

            const updated = await getOrderById(Number(id));
            setOrder(updated);
            setOrderStatus(updated.orderStatus);
        } catch (error: any) {
            showSnackbar(error?.response?.data?.message || "Failed to create label", 'error');
        }
    };


    if (!order) return <DashboardContent maxWidth="xl">Loading...</DashboardContent>;

    return (
        <DashboardContent maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            startIcon={<ArrowBackIcon/>}
                            onClick={() => router.push(`/orders?page=${page}`)}
                            variant="outlined"
                            size="small"
                            sx={{textTransform: 'none'}}
                        >
                            Back
                        </Button>
                        <Typography variant="h4" noWrap>
                            Order #{order.orderNumber}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.dateCreated).toLocaleString()}
                    </Typography>
                </Box>

                <Box>
                    {order.orderStatus === 'NEW' && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setDialogMode('IN_PROGRESS');
                                setOpenDialog(true);
                            }}
                        >
                            Start Processing
                        </Button>
                    )}
                    {order.orderStatus === 'IN_PROGRESS' && (
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                setDialogMode('READY_TO_SHIP');
                                setOpenDialog(true);
                            }}
                        >
                            Mark Ready to Ship
                        </Button>
                    )}
                    {order.orderStatus === 'READY_TO_SHIP' && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                                setDialogMode('SHIPPED');
                                setOpenDialog(true);
                            }}
                        >
                            Create Shipping Label
                        </Button>
                    )}
                </Box>
            </Box>

            <Box display="flex" flexDirection={{xs: 'column', lg: 'row'}} gap={3}>

                <Box flex={2} display="flex" flexDirection="column" gap={3}>
                    <ProductList lineItems={order.lineItems} baseURL={baseURL}/>
                </Box>

                <Box flex={1} display="flex" flexDirection="column" gap={3}>
                    <OrderSummary payment={order.payment} totalAmount={order.totalAmount}/>
                    <CustomerInfo order={order}/>
                    <ShippingInfo shippingAddress={order.shippingAddress}/>
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <Box p={3}>
                    <Typography variant="h6" gutterBottom>
                        {dialogMode === 'IN_PROGRESS'
                            ? 'Confirm Start Processing'
                            : dialogMode === 'READY_TO_SHIP'
                                ? 'Confirm Ready to Ship'
                                : 'Confirm Create Shipping Label'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {dialogMode === 'IN_PROGRESS'
                            ? 'Are you sure you want to mark this order as IN_PROGRESS?'
                            : dialogMode === 'READY_TO_SHIP'
                                ? 'Are you sure you want to mark this order as READY_TO_SHIP?'
                                : 'Are you sure you want to create a shipping label for this order?'}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button onClick={() => setOpenDialog(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color={dialogMode === 'IN_PROGRESS' ? 'secondary' : 'warning'}
                            onClick={async () => {
                                setOpenDialog(false);
                                if (dialogMode === 'IN_PROGRESS') {
                                    await handleStartProcessing();
                                } else if (dialogMode === 'READY_TO_SHIP') {
                                    await handleReadyToShip();
                                } else if (dialogMode === 'SHIPPED') {
                                    await handleCreateLabel();
                                }
                            }}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </DashboardContent>
    );
}
