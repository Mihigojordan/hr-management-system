import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Home from '../pages/landing/Home';
import MainLayout from '../layout/MainLayout';
import BlogsPage from '../pages/landing/BlogsPage';
import BlogViewPage from '../components/landing/BlogViewPage';
import AuthLayout from '../layout/AuthLayout';
import AdminLogin from '../pages/auth/Login';

import logo from "../assets/images/aby_hr.png";
import UnlockScreen from '../pages/auth/UnlockScreen';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import ProtectPrivateAdminRoute from '../components/protectors/ProtectPrivateAdminRoute';
import AdminProfile from '../pages/dashboard/AdminProfile';

const ProductPage = lazy(() => import('../pages/landing/FeaturesPage'));
const ServicesPage = lazy(() => import('../pages/landing/ServicePage'));
const ContactPage = lazy(() => import('../pages/landing/ContactUs'));
const AboutPage = lazy(() => import('../pages/landing/AboutPage'));


const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen bg-white">
        <img
            src={logo}
            alt="Loading..."
            className="h-40 animate-zoomInOut"
        />
    </div>
);

const SuspenseWrapper = ({ children }) => {
    return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};


const routes = createBrowserRouter([
    {
        path: '/',
        element: <Outlet />,
        children: [
            {
                path: '',
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <SuspenseWrapper> <Home /></SuspenseWrapper>
                    },
                    {
                        path: 'about',
                        element: <SuspenseWrapper><AboutPage /></SuspenseWrapper>
                    },
                    {
                        path: 'features',
                        element: <SuspenseWrapper><ProductPage /></SuspenseWrapper>
                    },
                    {
                        path: 'solutions',
                        element: <SuspenseWrapper> <ServicesPage /></SuspenseWrapper>
                    },
                    {
                        path: 'contact',
                        element: <SuspenseWrapper><ContactPage /></SuspenseWrapper>
                    },
                    {
                        path: 'blogs',
                        element: <SuspenseWrapper> <BlogsPage /></SuspenseWrapper>
                    },
                    {
                        path: 'blogs/:id',
                        element: <SuspenseWrapper><BlogViewPage /></SuspenseWrapper>
                    },
                ],
            },
            {
                path:'admin',
                element:  <SuspenseWrapper>
            <ProtectPrivateAdminRoute>
              <Outlet />
            </ProtectPrivateAdminRoute>
          </SuspenseWrapper>,
                children: [
                    {
                        index:true,
                        element: <Navigate to="/admin/dashboard" replace />
                    },
                    {
                        path:"dashboard",
                        element: <DashboardLayout />,
                        children: [
                            {
                                path:'',
                                element: <SuspenseWrapper> <DashboardHome /></SuspenseWrapper>
                            },
                            {
                                path:'profile',
                                element: <SuspenseWrapper> <AdminProfile /></SuspenseWrapper>
                            }
                           
                        ]
                            
                    }
                ]
                
            },

        ]
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "admin/login",
                element: <SuspenseWrapper><AdminLogin /></SuspenseWrapper>,
            },

            {
                path: "admin/unlock",
                element: <SuspenseWrapper><UnlockScreen /></SuspenseWrapper>,
            },
        ],
    },
])


export default routes;
