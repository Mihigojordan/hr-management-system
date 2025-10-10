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
import StoreManagement from '../pages/dashboard/StoreManagement';
import StoreFormExample from '../components/dashboard/store/StoreForm';
import StoreViewPage from '../components/dashboard/store/StoreViewMorePage';
import CageManagement from '../pages/dashboard/CageManagement';
import CageForm from '../components/dashboard/cage/CageForm';
import CageViewPage from '../components/dashboard/cage/CageViewMorePage';
import MedicationForm from '../components/dashboard/cage/MedicationForm';
import DailyFeedRecordForm from '../components/dashboard/cage/DailyFeedRecordForm';
import CategoryManagement from '../pages/dashboard/CategoryManagement';
import StockManagement from '../pages/dashboard/StockManagement';
import StockInForm from '../components/dashboard/stock/StockFormPage';
import StockInViewPage from '../components/dashboard/stock/StockInViewPage';
import StockRequestManagement from '../pages/dashboard/StockRequestManagement';
import StockRequestManagementDetails from '../pages/dashboard/StockRequestManagementDetails';
import StockHistory from '../pages/dashboard/StockHistory';
import PrivacyPolicy from '../pages/landing/PrivacyPolicy';
import TermsOfService from '../pages/landing/TermsOfService';
import ServiceAgreement from '../pages/landing/ServiceAgreement';
import DataProtection from '../pages/landing/DataProtection';
import EnvironmentalCompliance from '../pages/landing/EnvironmentalCompliance';

const ProductPage = lazy(() => import('../pages/landing/FeaturesPage'));
const ServicesPage = lazy(() => import('../pages/landing/ServicePage'));
const ContactPage = lazy(() => import('../pages/landing/ContactUs'));
const AboutPage = lazy(() => import('../pages/landing/AboutPage'));
const DepartmentDashboard = lazy(() => import('../pages/dashboard/DepartmentManagement'));
const SiteManagement = lazy(() => import('../pages/dashboard/SiteManagement')); 
const SiteAssignmentManagement = lazy(()=> import('../pages/dashboard/SiteAssignmentManagement'));
const AssetRequestManagement = lazy(() => import('../pages/dashboard/AssetRequestManagement'));
const RequestAssetsManagement = lazy(() => import('../pages/dashboard/admin/RequestedAssetsManagement'));
const ProcurementManagement = lazy(() => import('../pages/dashboard/ProcurementManagement'));
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
          {
            path: 'legal/privacy-policy',
            element: (
              <SuspenseWrapper>
                <PrivacyPolicy />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'legal/terms',
            element: (
              <SuspenseWrapper>
                <TermsOfService />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'legal/environmental',
            element: (
              <SuspenseWrapper>
                <EnvironmentalCompliance />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'legal/data-protection',
            element: (
              <SuspenseWrapper>
                <DataProtection />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'legal/service-agreement',
            element: (
              <SuspenseWrapper>
                <ServiceAgreement />
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
                path: 'requestedAssets-management',
                element: (
                  <SuspenseWrapper>
                    <RequestAssetsManagement role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'procurement-management',
                element: (
                  <SuspenseWrapper>
                    <ProcurementManagement role='admin' />
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
              {
                path:'site-management',
                element:(
                  <SuspenseWrapper>
                    <SiteManagement role='admin'/>
                  </SuspenseWrapper>
                )
              },
              {
                path:'assign-management',
                element:(
                  <SuspenseWrapper>
                    <SiteAssignmentManagement role='admin'/>
                  </SuspenseWrapper>
                )
              },
              {
                path: 'sto',
                element: (
                  <SuspenseWrapper>
                    <StoreManagement role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'store-management/create',
                element: (
                  <SuspenseWrapper>
                    <StoreFormExample role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'store-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <StoreFormExample role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'store-management/:id',
                element: (
                  <SuspenseWrapper>
                    <StoreViewPage  role='admin' />
                  </SuspenseWrapper>
                ),
              },
               {
                path: 'cage-management',
                element: (
                  <SuspenseWrapper>
                    <CageManagement  role='admin' />
                  </SuspenseWrapper>
                ),
              },
               {
                path: 'cage-management/create',
                element: (
                  <SuspenseWrapper>
                    <CageForm role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'cage-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <CageForm role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'cage-management/view/:id',
                element: (
                  <SuspenseWrapper>
                    <CageViewPage  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'cage-management/m/create',
                element: (
                  <SuspenseWrapper>
                    <MedicationForm  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'cage-management/m/update/:id',
                element: (
                  <SuspenseWrapper>
                    <MedicationForm  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'cage-management/f/create',
                element: (
                  <SuspenseWrapper>
                    <DailyFeedRecordForm  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'cage-management/f/update/:id',
                element: (
                  <SuspenseWrapper>
                    <DailyFeedRecordForm  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'category-management',
                element: (
                  <SuspenseWrapper>
                    <CategoryManagement  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management',
                element: (
                  <SuspenseWrapper>
                    <StockManagement  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management/create',
                element: (
                  <SuspenseWrapper>
                    <StockInForm  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <StockInForm  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management/:id',
                element: (
                  <SuspenseWrapper>
                    <StockInViewPage  role='admin' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-request',
                element: (
                  <SuspenseWrapper>
                    <StockRequestManagement  role='admin' />
                  </SuspenseWrapper>
                ),
              },
               {
                path: 'stock-request/:id',
                element: (
                  <SuspenseWrapper>
                    <StockRequestManagementDetails  role='admin' />
                  </SuspenseWrapper>
                ),
              },
               {
                path: 'stock-history',
                element: (
                  <SuspenseWrapper>
                    <StockHistory  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-history/:id',
                element: (
                  <SuspenseWrapper>
                    <StockHistory  role='employee' />
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
              {
                path: 'cage-management',
                element: (
                  <SuspenseWrapper>
                    <CageManagement  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'asset-request-management',
                element: (
                  <SuspenseWrapper>
                    <AssetRequestManagement  role='employee' />
                  </SuspenseWrapper>
                )
              },
               {
                path: 'category-management',
                element: (
                  <SuspenseWrapper>
                    <CategoryManagement  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management',
                element: (
                  <SuspenseWrapper>
                    <StockManagement  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management/create',
                element: (
                  <SuspenseWrapper>
                    <StockInForm  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <StockInForm  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-management/:id',
                element: (
                  <SuspenseWrapper>
                    <StockInViewPage  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-request',
                element: (
                  <SuspenseWrapper>
                    <StockRequestManagement  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-request/:id',
                element: (
                  <SuspenseWrapper>
                    <StockRequestManagementDetails  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-history',
                element: (
                  <SuspenseWrapper>
                    <StockHistory  role='employee' />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'stock-history/:id',
                element: (
                  <SuspenseWrapper>
                    <StockHistory  role='employee' />
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