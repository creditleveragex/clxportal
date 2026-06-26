import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [{ label: 'Partners', to: '/' }];

export default function Sidebar() {
  return (
    <nav
      style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--clx-surface)',
        borderRight: '1px solid var(--clx-border)',
        minHeight: '100vh',
        padding: '1.5rem 0',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          style={({ isActive }) => ({
            display: 'block',
            padding: '0.75rem 1.5rem',
            color: isActive ? 'var(--clx-accent)' : 'var(--clx-text-secondary)',
            borderLeft: isActive ? '3px solid var(--clx-accent)' : '3px solid transparent',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textDecoration: 'none',
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
