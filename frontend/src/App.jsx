import React, { lazy } from 'react';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import BlogsPage from './pages/BlogsPage';
import BlogViewPage from './components/BlogViewPage';

const ProductPage = lazy(() => import('./pages/FeaturesPage'));
const ServicesPage = lazy(() => import('./pages/ServicePage'));
const ContactPage = lazy(() => import('./pages/ContactUs'));
const AboutPage = lazy(() => import('./pages/AboutPage'));


const routes = createBrowserRouter([
  {
    path:'',
    element: <MainLayout />,
    children:[
      {
        index:true,
        element: <Home />
      },
      {
        path:'about',
        element: <AboutPage />
      },
      {
        path:'features',
        element: <ProductPage />
      },
      {
        path:'solutions',
        element: <ServicesPage />
      },
      {
        path:'contact',
        element: <ContactPage />
      },
      {
        path:'blogs',
        element: <BlogsPage />
      },
      {
        path:'blogs/:id',
        element: <BlogViewPage />
      },
    ]
  }
])



const App = () => {


  return (
    <>
    <RouterProvider router={routes}></RouterProvider>
    </>
  );
};

export default App;