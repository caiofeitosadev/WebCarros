import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './App';
import { RouterProvider } from 'react-router';
import AuthProvider from './contexts/AuthProvider';
import { register } from 'swiper/element-bundle';

register();

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />,
  </AuthProvider>,
);
