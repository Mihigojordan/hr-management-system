import React, { type FC, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Home from '../pages/landing/Home';
import MainLayout from '../layout/MainLayout';
import BlogsPage from '../pages/landing/BlogsPage';
import BlogViewPage from '../components/landing/BlogViewPage';
import AuthLayout from '../layout/AuthLayout';
import AdminLogin from '../pages/auth/Login';
import logo from '../assets/images/aby_hr.png';
import UnlockScreen from '../pages/auth/UnlockScreen';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import ProtectPrivateAdminRoute from '../components/protectors/ProtectPrivateAdminRoute';
import AdminProfile from '../pages/dashboard/AdminProfile';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';
import EmployeeFormExample from '../components/dashboard/employee/EmployeeForm';
import ContractDashboard from '../pages/dashboard/ContractManagement';
import ViewEmployee from '../components/dashboard/employee/EmployeeViewMorePage';
import RecruitementManagement from '../pages/dashboard/RecruitementManagement';
import UpserJobPost from '../components/dashboard/recruitment/UpsertJobPost';
import JobView from '../components/dashboard/recruitment/JobView';
import JobBoard from '../pages/landing/JobBoard';

const ProductPage = lazy(() => import('../pages/landing/FeaturesPage'));
const ServicesPage = lazy(() => import('../pages/landing/ServicePage'));
const ContactPage = lazy(() => import('../pages/landing/ContactUs'));
const AboutPage = lazy(() => import('../pages/landing/AboutPage'));
const DepartmentDashboard = lazy(() => import('../pages/dashboard/DepartmentManagement'));

/**
 * Loading spinner component for Suspense fallback
 */
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-screen bg-white">
    <img src={logo} alt="Loading..." className="h-40 animate-zoomInOut" />
  </div>
);

/**
 * Suspense wrapper for lazy-loaded components
 * @param props - Component props with children
 */
interface SuspenseWrapperProps {
  children: React.ReactNode;
}

const SuspenseWrapper: FC<SuspenseWrapperProps> = ({ children }) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

/**
 * Application routes configuration
 */
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
            element: (
              <SuspenseWrapper>
                <Home />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'about',
            element: (
              <SuspenseWrapper>
                <AboutPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'features',
            element: (
              <SuspenseWrapper>
                <ProductPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'solutions',
            element: (
              <SuspenseWrapper>
                <ServicesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs',
            element: (
              <SuspenseWrapper>
                <JobBoard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'contact',
            element: (
              <SuspenseWrapper>
                <ContactPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'blogs',
            element: (
              <SuspenseWrapper>
                <BlogsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'blogs/:id',
            element: (
              <SuspenseWrapper>
                <BlogViewPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: 'admin',
        element: (
          <SuspenseWrapper>
            <ProtectPrivateAdminRoute>
              <Outlet />
            </ProtectPrivateAdminRoute>
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              {
                path: '',
                element: (
                  <SuspenseWrapper>
                    <DashboardHome />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'profile',
                element: (
                  <SuspenseWrapper>
                    <AdminProfile />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'department-management',
                element: (
                  <SuspenseWrapper>
                    <DepartmentDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management',
                element: (
                  <SuspenseWrapper>
                    <EmployeeDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/:id',
                element: (
                  <SuspenseWrapper>
                    <ViewEmployee />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/create',
                element: (
                  <SuspenseWrapper>
                    <EmployeeFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <EmployeeFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'contract-management',
                element: (
                  <SuspenseWrapper>
                    <ContractDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management',
                element: (
                  <SuspenseWrapper>
                    <RecruitementManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/create',
                element: (
                  <SuspenseWrapper>
                    <UpserJobPost />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <UpserJobPost />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/:id',
                element: (
                  <SuspenseWrapper>
                    <JobView />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'admin/login',
        element: (
          <SuspenseWrapper>
            <AdminLogin />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/unlock',
        element: (
          <SuspenseWrapper>
            <UnlockScreen />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);

export default routes;