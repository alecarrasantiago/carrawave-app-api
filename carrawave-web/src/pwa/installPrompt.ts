/**
 * Ponte pro evento nativo do navegador que permite mostrar um botão
 * "Instalar app" dentro do próprio site (em vez de depender só do menu do
 * navegador). Só existe no Chrome/Android (e Chrome/Edge de desktop) — o
 * Safari/iOS nunca dispara esse evento, então lá a instalação continua
 * sendo manual (Compartilhar → Adicionar à Tela de Início).
 *
 * Módulo isolado (fora do React) porque o evento pode disparar antes de
 * qualquer componente montar — se escutássemos só dentro de um useEffect de
 * um componente que nem sempre está montado (a tela de Configurações), o
 * evento poderia ser perdido.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredEvent: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredEvent = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredEvent = null;
    notify();
  });
}

export function getInstallState() {
  return { canInstall: deferredEvent !== null, installed };
}

export function subscribeInstallState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredEvent) return false;
  await deferredEvent.prompt();
  const choice = await deferredEvent.userChoice;
  deferredEvent = null;
  notify();
  return choice.outcome === 'accepted';
}
