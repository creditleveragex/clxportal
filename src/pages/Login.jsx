import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setSubmitting(false);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--clx-surface)',
          border: '1px solid var(--clx-border)',
          padding: '2.5rem',
          width: '360px',
        }}
      >
        <h1 style={{ fontSize: '2rem', color: 'var(--clx-accent)', marginBottom: '0.25rem' }}>CLX PORTAL</h1>
        <p style={{ color: 'var(--clx-text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          B2B Partner Management
        </p>

        <label style={{ fontSize: '0.8rem', color: 'var(--clx-text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
          />
        </label>

        <label style={{ fontSize: '0.8rem', color: 'var(--clx-text-secondary)', display: 'block', marginBottom: '1rem' }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
          />
        </label>

        {error && <div style={{ color: 'var(--clx-churned)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: 'var(--clx-accent)',
            color: 'var(--clx-bg)',
            padding: '0.6rem',
            width: '100%',
            fontWeight: 700,
          }}
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
