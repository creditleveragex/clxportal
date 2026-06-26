export default function PlaceholderPage({ title, subtitle = 'This section is coming soon.', icon = '🚧', accentColor = '#8b9bb4' }) {
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
    </div>
  );
}
