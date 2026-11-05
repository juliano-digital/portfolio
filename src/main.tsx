import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
  void import('./pages/AdminPage').then(({ default: AdminPage }) => {
    root.render(
      <React.StrictMode>
        <AdminPage />
      </React.StrictMode>,
    );
  });
} else {
  void import('./App').then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
}
