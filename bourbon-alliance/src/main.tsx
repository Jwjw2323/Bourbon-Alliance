import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Purge any stale personal test sessions or notifications cached during development
try {
  const user = localStorage.getItem('bourbon_alliance_user');
  if (user && (user.includes('whitman') || user.includes('Whitman') || user.includes('jonathan'))) {
    localStorage.removeItem('bourbon_alliance_user');
  }
  const logs = localStorage.getItem('bourbon_notification_logs');
  if (logs && (logs.includes('whitman') || logs.includes('Whitman'))) {
    localStorage.removeItem('bourbon_notification_logs');
  }
} catch (e) {
  // ignore storage errors
}

createRoot(document.getElementById('root')!).render(<App />);
