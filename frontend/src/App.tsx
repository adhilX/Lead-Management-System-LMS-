import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

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
        element: <Dashboard />
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />
    }
])
function App() {
  return (
    <RouterProvider router={route} />
  );
}

export default App;
