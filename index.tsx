
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("------------------------------------------");
console.log("🚀 CORE: Application entry point active.");
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
    console.log("✅ CORE: React component tree mounted.");
  } catch (err) {
    console.error("❌ FATAL: React mounting failed:", err);
  }
}
