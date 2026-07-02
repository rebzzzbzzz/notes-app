import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { NotesProvider } from './context/NotesProvider';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

if (import.meta.env.DEV) {
  try {
    const response = await fetch(`${API_URL}/notes`);
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
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotesProvider>
      <App />
    </NotesProvider>
  </React.StrictMode>
);