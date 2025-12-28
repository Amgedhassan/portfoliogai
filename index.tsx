
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("🚀 [Frontend] index.tsx triggered. Attempting to mount React...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("❌ [Frontend] Critical: Root element #root not found!");
} else {
  // Clear the boot loader text
  const bootText = document.getElementById('boot-text');
  if (bootText) bootText.style.display = 'none';

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("✅ [Frontend] React mounted successfully.");
}
