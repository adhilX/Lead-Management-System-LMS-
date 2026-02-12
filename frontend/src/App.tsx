import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import { Toaster } from 'react-hot-toast';

const route = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: '',
        element: <Navigate to="/login" replace />
      }
    ]
  }
])
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={route} />
    </>
  );
}

export default App;
