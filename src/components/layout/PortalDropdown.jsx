import { useEffect, useRef } from 'react';

export const PORTALS = {
  biz: {
    key: 'biz',
    name: 'CLX Business',
    subtitle: 'B2B & B2C',
    mark: 'CB',
    markBg: '#d4a843',
    labelColor: '#f0c85a',
  },
  internal: {
    key: 'internal',
    name: 'CLX Internal',
    subtitle: 'Team operations',
    mark: 'CI',
    markBg: '#1a5080',
    labelColor: '#5a9fd4',
  },
  ai: {
    key: 'ai',
    name: 'CLX AI',
    subtitle: 'Tools & automations',
    mark: 'AI',
    markBg: '#5a1a90',
    labelColor: '#c084fc',
    disabled: true,
  },
};

export default function PortalDropdown({ activePortal, onSelect, open, onToggle, onClose, isPartner }) {
  const ref = useRef(null);
  const active = PORTALS[activePortal];

  useEffect(() => {
    if (!open || isPartner) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, isPartner]);

  if (isPartner) {
    return (
      <div style={{ padding: '0.75rem 0.75rem 1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            width: '100%',
            background: '#0f1620',
            border: '1px solid #1a2330',
            padding: '0.6rem 0.7rem',
          }}
        >
          <PortalMark portal={PORTALS.biz} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: PORTALS.biz.labelColor, fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }}>
              CLX Business
            </div>
            <div style={{ color: '#5a6a80', fontSize: '0.7rem', lineHeight: 1.2 }}>{PORTALS.biz.subtitle}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative', padding: '0.75rem 0.75rem 1rem' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          width: '100%',
          background: '#0f1620',
          border: '1px solid #1a2330',
          padding: '0.6rem 0.7rem',
          textAlign: 'left',
        }}
      >
        <PortalMark portal={active} size={30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: active.labelColor, fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }}>
            {active.name}
          </div>
          <div style={{ color: '#5a6a80', fontSize: '0.7rem', lineHeight: 1.2 }}>{active.subtitle}</div>
        </div>
        <span style={{ color: '#5a6a80', fontSize: '0.7rem', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0.75rem',
            right: '0.75rem',
            marginTop: '0.4rem',
            background: '#0f1620',
            border: '1px solid #1a2330',
            zIndex: 40,
          }}
        >
          {Object.values(PORTALS).map((portal) => (
            <button
              key={portal.key}
              onClick={() => {
                if (portal.disabled) return;
                onSelect(portal.key);
                onClose();
              }}
              disabled={portal.disabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                width: '100%',
                background: 'transparent',
                padding: '0.6rem 0.7rem',
                textAlign: 'left',
                borderBottom: '1px solid #1a2330',
                opacity: portal.disabled ? 0.5 : 1,
                cursor: portal.disabled ? 'default' : 'pointer',
              }}
            >
              <PortalMark portal={portal} size={26} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: portal.labelColor, fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>
                  {portal.name}
                </div>
                <div style={{ color: '#5a6a80', fontSize: '0.68rem', lineHeight: 1.2 }}>{portal.subtitle}</div>
              </div>
              {portal.disabled ? (
                <span
                  style={{
                    fontSize: '0.6rem',
                    color: '#8b9bb4',
                    border: '1px solid #1a2330',
                    padding: '0.1rem 0.4rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Soon
                </span>
              ) : (
                portal.key === activePortal && <span style={{ color: portal.labelColor }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PortalMark({ portal, size }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: portal.markBg,
        color: '#080c12',
        fontSize: size * 0.36,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {portal.mark}
    </div>
  );
}
