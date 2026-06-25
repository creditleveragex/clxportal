const LABELS = {
  active: 'Active',
  'at-risk': 'At Risk',
  churned: 'Churned',
};

const COLORS = {
  active: 'var(--clx-active)',
  'at-risk': 'var(--clx-at-risk)',
  churned: 'var(--clx-churned)',
};

export default function HealthBadge({ status }) {
  const color = COLORS[status] ?? 'var(--clx-text-secondary)';
  const label = LABELS[status] ?? status;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        border: `1px solid ${color}`,
        color,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </span>
  );
}
