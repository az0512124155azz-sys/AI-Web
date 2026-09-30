import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('Mount failure:', err);
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #020617; color: #f87171; font-family: system-ui, sans-serif; padding: 20px; text-align: center;">
        <div>
          <h2 style="font-size: 18px; margin-bottom: 8px;">שגיאה בעת הפעלת הממשק</h2>
          <p style="font-size: 13px; color: #94a3b8; max-width: 500px;">${String(err)}</p>
        </div>
      </div>
    `;
  }
}
