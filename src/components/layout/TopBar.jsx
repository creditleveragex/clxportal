import { PORTALS } from './PortalDropdown.jsx';

export default function TopBar({ activePortal, pageLabel, search, onSearchChange, primaryAction }) {
  const portal = PORTALS[activePortal];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: '#0f1620',
        borderBottom: '1px solid #1a2330',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', minWidth: 0 }}>
        <span style={{ color: portal.labelColor, fontWeight: 700, fontSize: '0.95rem' }}>{portal.name}</span>
        <span style={{ color: '#3a4456' }}>/</span>
        <span style={{ color: '#8b9bb4', fontSize: '0.9rem' }}>{pageLabel}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            background: '#080c12',
            border: '1px solid #1a2330',
            color: '#e5edf7',
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
      </div>
    </div>
  );
}
