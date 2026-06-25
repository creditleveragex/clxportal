import { supabase } from '../supabaseClient.js';

export default function Layout({ children }) {
  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 2rem',
          background: 'var(--clx-surface)',
          borderBottom: '1px solid var(--clx-border)',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', color: 'var(--clx-accent)' }}>CLX B2B PARTNER PORTAL</h1>
        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            border: '1px solid var(--clx-accent)',
            color: 'var(--clx-accent)',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
          }}
        >
          Sign Out
        </button>
      </header>
      <main style={{ padding: '2rem' }}>{children}</main>
    </div>
  );
}
