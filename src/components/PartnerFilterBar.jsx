const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'churned', label: 'Churned' },
];

export default function PartnerFilterBar({ activeFilter, onFilterChange, search, onSearchChange, onAddNew }) {
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

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          placeholder="Search partners..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ minWidth: '220px' }}
        />
        <button
          onClick={onAddNew}
          style={{
            background: 'var(--clx-accent)',
            color: 'var(--clx-bg)',
            padding: '0.5rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          + Add Partner
        </button>
      </div>
    </div>
  );
}
