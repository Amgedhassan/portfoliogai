
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("%c 🚀 SYSTEM: UI Kernel v2.4.0 Executing ", "background: #4f46e5; color: #fff; font-weight: bold; padding: 4px; border-radius: 4px;");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ FATAL: Root element (#root) missing in DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Clear boot loader on next tick
    setTimeout(() => {
      const bootStatus = document.getElementById('boot-status');
      if (bootStatus) bootStatus.style.display = 'none';
      console.log("✅ SYSTEM: Mount Complete");
    }, 0);

  } catch (err) {
    console.error("❌ FATAL: React mounting failed:", err);
    const status = document.getElementById('boot-status');
    if (status) status.innerHTML = `<span style="color:#ef4444">MOUNT_FAILED</span>`;
  }
}
