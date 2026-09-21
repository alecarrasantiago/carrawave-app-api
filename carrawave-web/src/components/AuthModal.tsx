import { useState, type CSSProperties, type FormEvent } from 'react';
import { login, register } from '../api/auth';
import { ApiError } from '../api/client';

interface Props {
  onClose: () => void;
  onSuccess: (info?: { favoritesMoved: number; sessionsMoved: number }) => void;
}

export function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = mode === 'login' ? await login(email, password) : await register(displayName, email, password);
      onSuccess(res.merged);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível conectar agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(24,16,10,.4)' }} />
      <form
        onSubmit={handleSubmit}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 360,
          borderRadius: 24,
          background: 'var(--surf)',
          border: '1.5px solid var(--line)',
          boxShadow: '0 20px 44px -18px rgba(46,43,37,.6)',
          padding: 22,
          animation: 'cw-in .2s ease',
        }}
      >
        <div className="cw-display" style={{ fontSize: 20 }}>
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </div>
        <div style={{ font: '500 12.5px Figtree', color: 'var(--ink60)', marginTop: 4 }}>
          Seus favoritos e histórico anônimos são mantidos ao entrar.
        </div>

        {mode === 'register' && (
          <input
            required
            placeholder="Nome"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={inputStyle}
          />
        )}
        <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input
          required
          type="password"
          minLength={8}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && <div style={{ font: '600 12px Figtree', color: '#c0392b', marginTop: 8 }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 14,
            width: '100%',
            height: 46,
            borderRadius: 999,
            border: 'none',
            background: 'var(--accent)',
            color: 'var(--onacc)',
            font: '700 14px Figtree',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Enviando…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <div
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{ marginTop: 12, textAlign: 'center', cursor: 'pointer', font: '600 12.5px Figtree', color: 'var(--accent-ink)' }}
        >
          {mode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
        </div>
      </form>
    </div>
  );
}

const inputStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: 44,
  marginTop: 12,
  padding: '0 14px',
  borderRadius: 14,
  border: '1.5px solid var(--line)',
  background: 'var(--bg)',
  font: '500 16px Figtree',
  color: 'var(--ink)',
  boxSizing: 'border-box',
};
