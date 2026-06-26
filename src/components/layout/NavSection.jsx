const ACTIVE_STYLES = {
  biz: { background: '#1a2c10', color: '#c8e060' },
  internal: { background: '#0d2035', color: '#5a9fd4' },
};

export default function NavSection({ dotColor, labelColor, label, tag, items, activePage, onSelect, theme }) {
  return (
    <div style={{ padding: '0.9rem 0.75rem 0.4rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0 0.45rem 0.5rem',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        <span style={{ color: labelColor, fontWeight: 700 }}>{label}</span>
        {tag && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.6rem',
              color: '#8050b0',
              border: '1px solid #1a2330',
              padding: '0.05rem 0.35rem',
            }}
          >
            {tag}
          </span>
        )}
      </div>

      {items.map((item) => {
        const isActive = activePage === item.key;
        const activeStyle = ACTIVE_STYLES[theme] ?? ACTIVE_STYLES.biz;

        return (
          <button
            key={item.key}
            disabled={item.disabled}
            onClick={() => !item.disabled && onSelect(item.key)}
            className={item.disabled ? '' : 'clx-nav-item'}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              textAlign: 'left',
              background: isActive ? activeStyle.background : 'transparent',
              color: item.disabled ? '#8b9bb4' : isActive ? activeStyle.color : '#b8c4d4',
              fontStyle: item.disabled ? 'italic' : 'normal',
              opacity: item.disabled ? 0.35 : 1,
              padding: '0.55rem 0.45rem',
              fontSize: '0.82rem',
              marginBottom: '0.1rem',
            }}
          >
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge != null && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  minWidth: '1.2rem',
                  textAlign: 'center',
                  padding: '0.1rem 0.35rem',
                  background: item.badgeColor === 'red' ? '#3a1418' : '#1a2330',
                  color: item.badgeColor === 'red' ? '#e5484d' : '#8b9bb4',
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
