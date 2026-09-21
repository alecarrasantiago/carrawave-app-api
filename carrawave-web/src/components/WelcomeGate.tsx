interface Props {
  onContinueAsGuest: () => void;
  onOpenAuth: () => void;
}

export function WelcomeGate({ onContinueAsGuest, onOpenAuth }: Props) {
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
        background: 'var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 28px -12px var(--accent)',
          }}
        >
          <svg width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="var(--onacc)" strokeWidth={2.6} strokeLinecap="round">
            <circle cx="16" cy="16" r="3.2" fill="var(--onacc)" stroke="none" />
            <path d="M10.2 10.2a8.2 8.2 0 000 11.6" />
            <path d="M21.8 10.2a8.2 8.2 0 010 11.6" />
            <path d="M6.3 6.3a13.7 13.7 0 000 19.4" />
            <path d="M25.7 6.3a13.7 13.7 0 010 19.4" />
          </svg>
        </div>

        <div className="cw-display" style={{ fontSize: 28, marginTop: 22 }}>Carra Wave</div>
        <div style={{ font: '500 14px Figtree', color: 'var(--ink60)', marginTop: 8, lineHeight: 1.5 }}>
          Sua sintonia, em qualquer lugar. Ouça rádios brasileiras ao vivo, favorite as suas e retome de onde parou.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 32 }}>
          <div
            onClick={onOpenAuth}
            style={{
              cursor: 'pointer',
              width: '100%',
              height: 50,
              borderRadius: 999,
              background: 'var(--accent)',
              color: 'var(--onacc)',
              font: '700 14.5px Figtree',
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
              font: '700 14.5px Figtree',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Continuar sem cadastro
          </div>
        </div>

        <div style={{ font: '500 11.5px Figtree', color: 'var(--ink40)', marginTop: 18, lineHeight: 1.5 }}>
          Sem cadastro, seus favoritos ficam guardados neste aparelho. Você pode criar uma conta depois em Configurações.
        </div>
      </div>
    </div>
  );
}
