// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { loadConfig } from './configContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);

loadConfig().then(() => {
  root.render(
    // <React.StrictMode>
    //   <App />
    // </React.StrictMode>
    <App />
  );
}).catch((error) => {
  root.render(
    <React.StrictMode>
      <div>Error loading config: {error.message}</div>
    </React.StrictMode>
  );
});
