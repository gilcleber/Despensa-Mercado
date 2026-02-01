
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const removeLoader = () => {
    const loader = document.getElementById('main-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 400);
    }
};

try {
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    // Remove o loader após o primeiro frame de renderização
    requestAnimationFrame(() => {
        setTimeout(removeLoader, 200);
    });
} catch (e) {
    console.error("Critical Render Error", e);
    removeLoader();
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered');
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
