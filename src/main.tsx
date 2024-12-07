import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initializeLayoutHandler } from './utils/layout';
import './index.css';

function Root() {
  useEffect(() => {
    const cleanup = initializeLayoutHandler();
    return () => cleanup();
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);