import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './App';
import { RouterProvider } from 'react-router';
import AuthProvider from './contexts/AuthProvider';
import { register } from 'swiper/element-bundle';
import { Toaster } from 'react-hot-toast';

register();

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <Toaster position="top-right" reverseOrder={false} />
    <RouterProvider router={router} />,
  </AuthProvider>,
);
