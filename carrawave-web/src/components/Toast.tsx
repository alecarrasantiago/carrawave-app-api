interface Props {
  message: string | null;
  sidebarWidth: number;
  bottom?: number;
}

export function Toast({ message, sidebarWidth, bottom = 96 }: Props) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: sidebarWidth,
        right: 0,
        bottom,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          padding: '10px 20px',
          borderRadius: 999,
          background: 'var(--ink)',
          color: 'var(--bg)',
          font: '600 13px Figtree',
          animation: 'cw-in .22s ease',
          textAlign: 'center',
        }}
      >
        {message}
      </div>
    </div>
  );
}
