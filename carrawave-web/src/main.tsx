import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Elemento #root não encontrado em index.html');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Registra o service worker depois que a página carregar, pra não competir
// com o carregamento inicial. É o que habilita "Adicionar à tela de início"
// em modo standalone no Android/Chrome (no iOS o Safari não exige isso, mas
// não faz mal ter).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silencioso — sem service worker o site continua funcionando normal,
      // só sem o botão de instalar em alguns navegadores.
    });
  });
}
