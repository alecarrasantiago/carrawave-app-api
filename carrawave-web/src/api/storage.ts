/**
 * Camada de armazenamento local. Hoje usa localStorage (web).
 * Quando o Capacitor entrar (Android), troque a implementação interna por
 * @capacitor/preferences SEM mudar quem consome este módulo — é por isso
 * que existe essa abstração em vez de chamar localStorage direto.
 */
const memoryFallback = new Map<string, string>();

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memoryFallback.get(key) ?? null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    memoryFallback.set(key, value);
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    memoryFallback.delete(key);
  }
}

export const storage = {
  get: safeGet,
  set: safeSet,
  remove: safeRemove,
};
