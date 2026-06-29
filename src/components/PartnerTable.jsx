import { useNavigate } from 'react-router-dom';
import HealthBadge from './HealthBadge.jsx';

export default function PartnerTable({ partners, onEdit, onFlag }) {
  const navigate = useNavigate();

  if (partners.length === 0) {
    return (
      <div style={{ color: 'var(--clx-text-secondary)', padding: '2rem 0' }}>
        No partners match the current filters.
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--clx-border)' }}>
          {['Business', 'Contact', 'Email', 'Phone', 'Health', 'Flagged', ''].map((h) => (
            <th
              key={h}
              style={{
                padding: '0.75rem 0.5rem',
                color: 'var(--clx-text-secondary)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {partners.map((p) => (
          <tr
            key={p.id}
            onClick={() => navigate(`/business/b2b/partners/${p.id}`)}
            style={{
              borderBottom: '1px solid var(--clx-border)',
              background: p.flagged_for_review ? 'rgba(212,175,55,0.06)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <td style={{ padding: '0.75rem 0.5rem' }}>{p.business_name || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem' }}>
              {[p.first_name, p.last_name].filter(Boolean).join(' ') || '—'}
            </td>
            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--clx-text-secondary)' }}>{p.email || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--clx-text-secondary)' }}>{p.phone || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem' }}>
              <HealthBadge status={p.health_status} />
            </td>
            <td style={{ padding: '0.75rem 0.5rem' }}>
              {p.flagged_for_review ? (
                <span style={{ color: 'var(--clx-accent)', fontSize: '0.85rem' }}>⚑ Flagged</span>
              ) : (
                <span style={{ color: 'var(--clx-text-secondary)' }}>—</span>
              )}
            </td>
            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(p);
                }}
                style={{
                  background: 'transparent',
                  color: 'var(--clx-text)',
                  border: '1px solid var(--clx-border)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  marginRight: '0.5rem',
                }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFlag(p);
                }}
                style={{
                  background: 'transparent',
                  color: 'var(--clx-accent)',
                  border: '1px solid var(--clx-accent)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                }}
              >
                {p.flagged_for_review ? 'Unflag' : 'Flag'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
