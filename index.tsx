
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("------------------------------------------");
console.log("🚀 CORE: Application entry point active.");
console.log("📍 Version: 2.3.0");
console.log("------------------------------------------");

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
    
    // Clear boot loader
    const bootStatus = document.getElementById('boot-status');
    if (bootStatus) bootStatus.style.display = 'none';

    console.log("✅ CORE: React component tree mounting...");
  } catch (err) {
    console.error("❌ FATAL: React mounting failed:", err);
  }
}
