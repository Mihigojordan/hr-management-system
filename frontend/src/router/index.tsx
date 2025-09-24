/* eslint-disable react-refresh/only-export-components */
import React, { type FC, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Home from '../pages/landing/Home';
import MainLayout from '../layout/MainLayout';
import BlogsPage from '../pages/landing/BlogsPage';
import BlogViewPage from '../components/landing/BlogViewPage';
import AuthLayout from '../layout/AuthLayout';
import AdminLogin from '../pages/auth/admin/Login';
import logo from '../assets/images/aby_hr.png';
import UnlockScreen from '../pages/auth/admin/UnlockScreen';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import ProtectPrivateAdminRoute from '../components/protectors/ProtectPrivateAdminRoute';
import AdminProfile from '../pages/dashboard/admin/AdminProfile';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';
import EmployeeFormExample from '../components/dashboard/employee/EmployeeForm';
import ContractDashboard from '../pages/dashboard/ContractManagement';
import ViewEmployee from '../components/dashboard/employee/EmployeeViewMorePage';
import RecruitementManagement from '../pages/dashboard/RecruitementManagement';
import UpserJobPost from '../components/dashboard/recruitment/UpsertJobPost';
import JobView from '../components/dashboard/recruitment/JobView';
import JobBoard from '../pages/landing/JobBoard';
import JobPostView from '../components/landing/JobViewPage';
import JobApplicationForm from '../components/landing/ApplyJob';
import ApplicantView from '../components/dashboard/recruitment/ApplicantView';
import ClientManagement from '../pages/dashboard/ClientManagement';
import AssetManagement from '../pages/dashboard/AssetManagement';
import AddAssetPage from '../components/dashboard/asset/AddAssetPage';
import EditAssetPage from '../components/dashboard/asset/EditAssetPage';
import AssetViewPage from '../components/dashboard/asset/AssetViewPage';
import EmployeeLogin from '../pages/auth/employee/EmployeeLogin';
import EmployeeUnlockScreen from '../pages/auth/employee/EmployeeUnlockScreen';
import ProtectPrivateEmployeeRoute from '../components/protectors/ProtectPrivateEmployeeRoute';
import EmployeeProfilePage from '../pages/dashboard/employee/EmployeeProfilePage';

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
            path: 'jobs',
            element: (
              <SuspenseWrapper>
                <JobBoard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs/:id',
            element: (
              <SuspenseWrapper>
                <JobPostView />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/jobs/apply-job/:id',
            element: (
              <SuspenseWrapper>
                <JobApplicationForm />
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
            element: <DashboardLayout role='admin' />,
            children: [
              {
                path: '',
                element: (
                  <SuspenseWrapper>
                    <DashboardHome role='admin'/>
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'profile',
                element: (
                  <SuspenseWrapper>
                    <AdminProfile  />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'department-management',
                element: (
                  <SuspenseWrapper>
                    <DepartmentDashboard role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management',
                element: (
                  <SuspenseWrapper>
                    <EmployeeDashboard role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/:id',
                element: (
                  <SuspenseWrapper>
                    <ViewEmployee role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/create',
                element: (
                  <SuspenseWrapper>
                    <EmployeeFormExample role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <EmployeeFormExample role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'contract-management',
                element: (
                  <SuspenseWrapper>
                    <ContractDashboard role='admin'/>
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management',
                element: (
                  <SuspenseWrapper>
                    <RecruitementManagement role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/create',
                element: (
                  <SuspenseWrapper>
                    <UpserJobPost role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <UpserJobPost role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/:id',
                element: (
                  <SuspenseWrapper>
                    <JobView role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/:jobId/applicants/:applicantId',
                element: (
                  <SuspenseWrapper>
                    <ApplicantView role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'client-management',
                element: (
                  <SuspenseWrapper>
                    <ClientManagement role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management',
                element: (
                  <SuspenseWrapper>
                    <AssetManagement role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management/create',
                element: (
                  <SuspenseWrapper>
                    <AddAssetPage role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <EditAssetPage role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management/:id',
                element: (
                  <SuspenseWrapper>
                    <AssetViewPage  role='admin' />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
         {
        path: 'employee',
        element: (
          <SuspenseWrapper>
            <ProtectPrivateEmployeeRoute>
              <Outlet />
            </ProtectPrivateEmployeeRoute>
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/employee/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardLayout role='employee' />,
            children: [
              {
                path: '',
                element: (
                  <SuspenseWrapper>
                    <DashboardHome role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'profile',
                element: (
                  <SuspenseWrapper>
                    <EmployeeProfilePage  />
                  </SuspenseWrapper>
                ),
              },
          
              {
                path: 'client-management',
                element: (
                  <SuspenseWrapper>
                    <ClientManagement role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management',
                element: (
                  <SuspenseWrapper>
                    <AssetManagement role='employee'/>
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management/create',
                element: (
                  <SuspenseWrapper>
                    <AddAssetPage role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <EditAssetPage role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-management/:id',
                element: (
                  <SuspenseWrapper>
                    <AssetViewPage  role='employee' />
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
      {
        path: 'employee/login',
        element: (
          <SuspenseWrapper>
            <EmployeeLogin />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'employee/unlock',
        element: (
          <SuspenseWrapper>
            <EmployeeUnlockScreen />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);

export default routes;

