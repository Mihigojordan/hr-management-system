import { type FC} from 'react';
import { RouterProvider} from 'react-router-dom';
import routes from './router';
import { SocketProvider } from './context/SocketContext';

/**
 * Main App component
 * Sets up the application routing using RouterProvider
 */
const App: FC = () => {
  return (
    <>
      <SocketProvider serverUrl={"http://localhost:3000"} >
        <RouterProvider router={routes} />
      </SocketProvider>
    </>
  );
};

export default App;