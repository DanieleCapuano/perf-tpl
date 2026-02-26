import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for PWA support
registerSW({
  onNeedRefresh() {
    console.log('[PWA] New content available, please refresh.');
  },
  onOfflineReady() {
    console.log('[PWA] App ready to work offline.');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
