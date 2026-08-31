import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="pageLoading" role="status">Loading…</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
