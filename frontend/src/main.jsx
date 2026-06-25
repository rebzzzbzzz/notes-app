import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';


if (import.meta.env.DEV) {
  try {
    const response = await fetch('http://localhost:5000/notes');
    if (response.ok) {
      console.log(' Бэкенд доступен, MSW выключен');
    } else {
      throw new Error('Бэкенд не отвечает');
    }
  } catch {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log(' MSW включен (бэкенд не доступен)');
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);