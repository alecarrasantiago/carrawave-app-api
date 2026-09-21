interface Props {
  message: string | null;
  sidebarWidth: number;
}

export function Toast({ message, sidebarWidth }: Props) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: sidebarWidth,
        right: 0,
        bottom: 96,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
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
        }}
      >
        {message}
      </div>
    </div>
  );
}
