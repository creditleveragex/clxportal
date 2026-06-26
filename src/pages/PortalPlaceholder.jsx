export default function PortalPlaceholder({ icon, title, subtitle, accentColor, chips, onChipClick }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1rem',
        gap: '0.75rem',
      }}
    >
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
      <h2 style={{ fontSize: '1.6rem', color: accentColor }}>{title}</h2>
      <p style={{ color: '#8b9bb4', maxWidth: '420px' }}>{subtitle}</p>

      {chips?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => onChipClick?.(chip.key)}
              style={{
                background: '#0f1620',
                border: `1px solid ${accentColor}`,
                color: accentColor,
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
