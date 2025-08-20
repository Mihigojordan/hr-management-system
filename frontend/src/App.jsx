import React, { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './router';

const App = () => {


  return (
    <>
    <RouterProvider router={routes}></RouterProvider>
    </>
  );
};

export default App;