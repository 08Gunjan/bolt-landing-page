import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AuthCallback from './pages/AuthCallback';
import './index.css';

const rootElement = document.getElementById('root')!;

// Determine which component to render based on the URL path
const renderComponent = () => {
  if (window.location.pathname === '/auth/callback') {
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
    return <AuthCallback />;
  } else {
    return <App />;
  }
};

createRoot(rootElement).render(
  <StrictMode>
    {renderComponent()}
  </StrictMode>
);
