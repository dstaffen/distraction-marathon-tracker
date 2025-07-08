
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Performance monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Log performance metrics
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('App loaded in', perfData.loadEventEnd - perfData.fetchStart, 'ms');
  });

  // Error reporting
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App />);
