import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Outlet, RouterProvider, createBrowserRouter} from 'react-router';

import App from './app';
import {routesSection} from './routes/sections';
import {ErrorBoundary} from './routes/components';
import {CartProvider} from "./sections/home/create-order/cart/cart-context";

// ----------------------------------------------------------------------

const router = createBrowserRouter([
    {
        Component: () => (
            <App>
                <Outlet/>
            </App>
        ),
        errorElement: <ErrorBoundary/>,
        children: routesSection,
    },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
    <StrictMode>
        <CartProvider>
            <RouterProvider router={router}/>
        </CartProvider>
    </StrictMode>
);
