import { useState, useEffect } from 'react';
import { PORTALS } from './PortalDropdown.jsx';

export default function TopBar({ activePortal, pageLabel, search, onSearchChange, primaryAction }) {
  const portal = PORTALS[activePortal];
  const [theme, setTheme] = useState(() => localStorage.getItem('clx-theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('clx-theme', theme);
  }, [theme]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', minWidth: 0 }}>
        <span style={{ color: portal.labelColor, fontWeight: 700, fontSize: '0.95rem' }}>{portal.name}</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{pageLabel}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '0.45rem 0.75rem',
            fontSize: '0.85rem',
            minWidth: '200px',
          }}
        />
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            style={{
              background: portal.markBg,
              color: '#080c12',
              padding: '0.5rem 1.1rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
            }}
          >
            {primaryAction.label}
          </button>
        )}
        <button
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          <i className={`ti ti-${theme === 'light' ? 'moon' : 'sun'}`} style={{ fontSize: 15 }} />
        </button>
      </div>
    </div>
  );
}
