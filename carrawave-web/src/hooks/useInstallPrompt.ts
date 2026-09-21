import { useEffect, useState } from 'react';
import { getInstallState, subscribeInstallState, promptInstall } from '../pwa/installPrompt';

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOSDevice = /iphone|ipad|ipod/i.test(ua);
  // iPadOS 13+ se identifica como "MacIntel" — só o multitouch denuncia que é um iPad.
  const isIPadOS = navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1;
  return isIOSDevice || isIPadOS;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
}

/**
 * Estado de "instalar como app" pra usar na tela de Configurações. No
 * Android/Chrome, `canInstall` liga um botão real que abre o prompt nativo
 * de instalação. No iPhone/Safari isso nunca acontece — lá só resta mostrar
 * o passo a passo manual (`isIOS`).
 */
export function useInstallPrompt() {
  const [state, setState] = useState(getInstallState());

  useEffect(() => subscribeInstallState(() => setState(getInstallState())), []);

  return {
    canInstall: state.canInstall,
    installed: state.installed || detectStandalone(),
    isIOS: detectIOS(),
    promptInstall,
  };
}
