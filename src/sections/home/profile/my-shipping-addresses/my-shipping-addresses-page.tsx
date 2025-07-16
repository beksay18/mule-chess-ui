import * as React from 'react';
import {
    Container,
} from '@mui/material';
import {getCurrentUser} from '../../../../api';
import ShippingAddressSection from "./shipping-address-section";

export default function MyShippingAddressesPage() {
    const user = getCurrentUser();

    return (
        <Container sx={{mt: 5}}>
            {user?.userId && (
                <>
                    <ShippingAddressSection userId={user.userId}/>
                </>
            )}
        </Container>
    );
}

