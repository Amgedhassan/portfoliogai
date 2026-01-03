import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * UI Kernel Entry Point
 * Responsible for orchestrating the React hydration and application boot sequence.
 */
console.log("%c 🚀 SYSTEM: UI Kernel v5.0.1 Executing ", "background: #4f46e5; color: #fff; font-weight: bold; padding: 4px; border-radius: 4px;");

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
    
    // Clear boot loader on next tick to ensure smooth transition
    setTimeout(() => {
      const bootStatus = document.getElementById('boot-status');
      if (bootStatus) {
        bootStatus.style.transition = 'opacity 0.5s ease';
        bootStatus.style.opacity = '0';
        setTimeout(() => {
          bootStatus.style.display = 'none';
        }, 500);
      }
      console.log("✅ SYSTEM: UI Kernel Hydrated");
    }, 100);

  } catch (err) {
    console.error("❌ FATAL: React mounting failed:", err);
    const status = document.getElementById('boot-status');
    if (status) {
      status.innerHTML = `
        <div style="color:#ef4444; font-family: monospace; background: rgba(0,0,0,0.9); padding: 32px; border-radius: 24px; border: 1px solid rgba(239, 68, 68, 0.2); text-align: center;">
          <h2 style="margin: 0 0 16px 0; font-weight: 900; letter-spacing: -0.05em;">MOUNT_CRITICAL_ERROR</h2>
          <p style="font-size: 12px; opacity: 0.6; line-height: 1.6;">The application kernel encountered a fatal exception during initialization. Check the system console for stack trace information.</p>
        </div>
      `;
    }
  }
}
