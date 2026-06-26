const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'churned', label: 'Churned' },
  { value: 'flagged', label: 'Flagged' },
];

export default function PartnerFilterBar({ activeFilter, onFilterChange, resultCount }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            style={{
              padding: '0.5rem 1rem',
              background: activeFilter === f.value ? 'var(--clx-accent)' : 'transparent',
              color: activeFilter === f.value ? 'var(--clx-bg)' : 'var(--clx-text)',
              border: '1px solid var(--clx-border)',
              fontSize: '0.85rem',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ color: 'var(--clx-text-secondary)', fontSize: '0.85rem' }}>
        {resultCount} {resultCount === 1 ? 'partner' : 'partners'}
      </div>
    </div>
  );
}
