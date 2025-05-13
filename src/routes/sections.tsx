import type {RouteObject} from 'react-router';

import {lazy, Suspense} from 'react';
import {Outlet} from 'react-router-dom';
import {varAlpha} from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';

import {AuthLayout} from 'src/layouts/auth';
import {DashboardLayout} from 'src/layouts/dashboard';
import AuthGuard from "./auth-guard";
import {HomeView} from "../sections/home/view";
import {ProductsView} from "../sections/home/create-order/products/view";
import {ProductDetailsView} from "../sections/home/create-order/product-details/view";
import {ProductUploadView} from "../sections/home/create-order/product-upload/view";
import RoleGuard from "./role-guard";
import {CartView} from "../sections/home/create-order/cart/view";
import {CheckoutView} from "../sections/home/create-order/checkout/view";
import {OrderConfirmationView} from "../sections/home/create-order/order-confirmation/view";
import {OrderView} from "../sections/orders/view";

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const UserPage = lazy(() => import('src/pages/user'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProductForm = lazy(() => import('src/sections/products/product-form'));
export const ProductTypesPage = lazy(() => import('src/pages/product-types'));
export const ProductTypeForm = lazy(() => import('src/sections/productTypes/product-type-form'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));


const renderFallback = () => (
    <Box
        sx={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: {bgcolor: 'text.primary'},
            }}
        />
    </Box>
);

export const routesSection: RouteObject[] = [
    {
        element: (
            <AuthGuard>
                <DashboardLayout>
                    <Suspense fallback={renderFallback()}>
                        <Outlet/>
                    </Suspense>
                </DashboardLayout>
            </AuthGuard>
        ),
        children: [
            {path: 'dashboard', element: <DashboardPage/>},
            {path: 'orders', element: <OrdersPage/>},
            {path: 'user', element: <UserPage/>},
            {
                path: 'products-types',
                children: [
                    {path: '', element: <ProductTypesPage/>},
                    {
                        path: 'product-types-form',
                        children: [
                            {index: true, element: <ProductTypeForm/>},
                            {path: ':id', element: <ProductTypeForm/>},
                        ],
                    },
                ],
            },
            {
                path: 'products',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <Outlet />
                    </RoleGuard>
                ),
                children: [
                    {path: '', element: <ProductsPage/>},
                    {
                        path: 'product-form',
                        children: [
                            {index: true, element: <ProductForm/>},
                            {path: ':id', element: <ProductForm/>},
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: 'sign-in',
        element: (
            <AuthLayout>
                <SignInPage/>
            </AuthLayout>
        ),
    },
    {
        path: 'sign-up',
        element: (
            <AuthLayout>
                <SignUpPage/>
            </AuthLayout>
        ),
    },
    {
        path: '',
        element: <HomeView/>,
    },
    {
        index: true,
        element: <HomeView/>,
    },
    {
        path: 'custom-products/:typeId',
        element: <ProductsView />,
    },
    {
        path: 'custom-product-details/:productId',
        element: <ProductDetailsView />,
    },
    {
        path: 'product-upload/:id',
        element: <ProductUploadView />,
    },
    {
        path: 'cart',
        element: <CartView />,
    },
    {
        path: 'checkout',
        element: <CheckoutView />,
    },
    {
        path: 'order-confirmation',
        element: <OrderConfirmationView />,
    },
    {
        path: 'profile',
        element: <ProfilePage />,
    },
    {
        path: '404',
        element: <Page404/>,
    },
    {path: '*', element: <Page404/>},
];
