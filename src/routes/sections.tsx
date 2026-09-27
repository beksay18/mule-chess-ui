import type {RouteObject} from 'react-router';

import {lazy, Suspense} from 'react';
import {Outlet} from 'react-router-dom';
import {varAlpha} from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';

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
import FaqForm from "../sections/faq/faq-form";

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const UserPage = lazy(() => import('src/pages/user'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const ContactsPage = lazy(() => import('src/pages/contacts'));
export const OrderDetailsPage = lazy(() => import('src/pages/order-details'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProfilePage = lazy(() => import('src/pages/profile/profile'));
export const MyOrdersPage = lazy(() => import('src/pages/profile/my-orders'));
export const MyShippingAddressesPage = lazy(() => import('src/pages/profile/my-shipping-addresses'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProductForm = lazy(() => import('src/sections/products/product-form'));
export const ContactForm = lazy(() => import('src/pages/contacts-form'));
export const ProductTypesPage = lazy(() => import('src/pages/product-types'));
export const ProductTypeForm = lazy(() => import('src/sections/productTypes/product-type-form'));
export const FaqPage = lazy(() => import('src/pages/faq'));
export const BlogAdminPage = lazy(() => import('src/pages/blog-admin'));
export const BlogPostForm = lazy(() => import('src/sections/blog/blog-form'));
export const FaqTitleForm = lazy(() => import('src/sections/faq/faq-title-form'));
export const HelpPage = lazy(() => import('src/pages/help'));
export const ReturnsPage = lazy(() => import('src/pages/returns'));
export const AboutUsPage = lazy(() => import('src/pages/about-us'));
export const ForBusinessPage = lazy(() => import('src/pages/for-business'));
export const PrivacyPage = lazy(() => import('src/pages/privacy'));
export const TermsPage = lazy(() => import('src/pages/terms'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const BlogArticlePage = lazy(() => import('src/pages/blog-article'));
export const StickerBuilderPage = lazy(() => import('src/pages/sticker-builder'));
export const MyDesignsPage = lazy(() => import('../pages/profile/my-designs'));
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
        path: '/',
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
            {
                path: 'dashboard',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <DashboardPage/>
                    </RoleGuard>
                ),
            },
            {
                path: 'orders',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <OrdersPage/>
                    </RoleGuard>
                ),
            },
            {
                path: 'user',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                        <UserPage/>
                    </RoleGuard>
                ),
            },
            {
                path: 'contacts',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <ContactsPage/>
                    </RoleGuard>
                ),
            },
            {
                path: 'products-types',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <Outlet/>
                    </RoleGuard>
                ),
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
                path: 'products/:typeId',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <Outlet/>
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
            {
                path: 'faq',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <Outlet/>
                    </RoleGuard>
                ),
                children: [
                    {path: '', element: <FaqPage/>},
                    {
                        path: 'faq-title-form',
                        children: [
                            {index: true, element: <FaqTitleForm/>},
                            {path: ':id', element: <FaqTitleForm/>},
                        ],
                    },
                    {
                        path: 'faq-form/:titleId/:faqId?',
                        element: <FaqForm />,
                    },
                ],
            },
            {
                path: 'blog-posts',
                element: (
                    <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                        <Outlet/>
                    </RoleGuard>
                ),
                children: [
                    {path: '', element: <BlogAdminPage/>},
                    {
                        path: 'form',
                        children: [
                            {index: true, element: <BlogPostForm/>},
                            {path: ':id', element: <BlogPostForm/>},
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: 'order-details/:id',
        element: (
            <AuthGuard>
                <Suspense fallback={renderFallback()}>
                    <OrderDetailsPage/>
                </Suspense>
            </AuthGuard>
        ),
    },
    {
        path: 'sign-in',
        element: (
            <SignInPage/>
        ),
    },
    {
        path: 'sign-up',
        element: (
            <SignUpPage/>
        ),
    },
    {
        path: 'contact-us',
        element: (
            <ContactForm/>
        ),
    },
    {
        index: true,
        element: <HomeView/>,
    },
    {
        path: 'custom-products/:typeId',
        element: <ProductsView/>,
    },
    {
        path: 'custom-product-details/:productId',
        element: <ProductDetailsView/>,
    },
    {
        path: 'product-upload/:id',
        element: <ProductUploadView/>,
    },
    {
        path: 'sticker-builder',
        element: <StickerBuilderPage/>,
    },
    {
        path: 'cart',
        element: <CartView/>,
    },
    {
        path: 'checkout',
        element: <CheckoutView/>,
    },
    {
        path: 'order-confirmation',
        element: <OrderConfirmationView/>,
    },
    {
        path: 'profile',
        element: <ProfilePage/>,
    },
    {
        path: 'my-orders',
        element: <MyOrdersPage/>,
    },
    {
        path: 'my-shipping-addresses',
        element: <MyShippingAddressesPage/>,
    },
    {
        path: 'my-designs',
        element: <MyDesignsPage/>,
    },
    {
        path: 'help',
        element: <HelpPage/>,
    },
    {
        path: 'returns',
        element: <ReturnsPage/>,
    },
    {
        path: 'about-us',
        element: <AboutUsPage/>,
    },
    {
        path: 'for-business',
        element: <ForBusinessPage/>,
    },
    {
        path: 'privacy',
        element: <PrivacyPage/>,
    },
    {
        path: 'terms',
        element: <TermsPage/>,
    },
    {
        path: 'blog',
        element: <BlogPage/>,
    },
    {
        path: 'blog/:id',
        element: <BlogArticlePage/>,
    },
    {
        path: '404',
        element: <Page404/>,
    },
    {path: '*', element: <Page404/>},
];
