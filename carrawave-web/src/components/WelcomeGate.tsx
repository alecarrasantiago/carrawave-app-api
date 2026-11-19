import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { Logo } from './Logo';

interface Props {
  onContinueAsGuest: () => void;
  onOpenAuth: () => void;
}

export function WelcomeGate({ onContinueAsGuest, onOpenAuth }: Props) {
  const { canInstall, installed, isIOS, promptInstall } = useInstallPrompt();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background:
          'radial-gradient(120% 55% at 50% 115%, rgba(168,85,247,.38), transparent 62%), radial-gradient(70% 45% at 100% 0%, rgba(34,211,238,.12), transparent 60%), var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Logo stacked size={46} />

        <div style={{ font: '500 14px Manrope', color: 'var(--ink60)', marginTop: 20, lineHeight: 1.5 }}>
          Rádios do Brasil inteiro, ao vivo. Favorite as suas e retome de onde parou.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 32 }}>
          <div
            onClick={onOpenAuth}
            style={{
              cursor: 'pointer',
              width: '100%',
              height: 50,
              borderRadius: 999,
              background: 'var(--brand-gradient)',
              color: 'var(--onacc)',
              font: '700 14.5px Manrope',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 24px -12px var(--accent)',
            }}
          >
            Entrar ou criar conta
          </div>
          <div
            onClick={onContinueAsGuest}
            className="cw-hover-soft"
            style={{
              cursor: 'pointer',
              width: '100%',
              height: 50,
              borderRadius: 999,
              border: '1.5px solid var(--line)',
              color: 'var(--ink)',
              font: '700 14.5px Manrope',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Continuar sem cadastro
          </div>
        </div>

        <div style={{ font: '500 11.5px Manrope', color: 'var(--ink40)', marginTop: 18, lineHeight: 1.5 }}>
          Sem cadastro, seus favoritos ficam guardados neste aparelho. Você pode criar uma conta depois em Configurações.
        </div>

        {!installed && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid var(--line)',
              width: '100%',
            }}
          >
            {canInstall ? (
              <div
                onClick={() => promptInstall()}
                className="cw-hover-soft"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1.5px solid var(--line)',
                  font: '600 12px Manrope',
                  color: 'var(--ink60)',
                }}
              >
                Instalar CarraWave Music como app
              </div>
            ) : (
              <div style={{ font: '500 11.5px Manrope', color: 'var(--ink40)', lineHeight: 1.5 }}>
                {isIOS
                  ? 'Dica: toque em Compartilhar e depois em "Adicionar à Tela de Início" para instalar como app.'
                  : 'Dica: procure "Instalar app" ou "Adicionar à tela inicial" no menu do navegador para instalar.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
