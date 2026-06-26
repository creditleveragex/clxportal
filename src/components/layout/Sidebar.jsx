import { useState } from 'react';
import PortalDropdown from './PortalDropdown.jsx';
import NavSection from './NavSection.jsx';
import { supabase } from '../../supabaseClient.js';

const BIZ_PARTNER_ITEMS = (counts) => [
  { key: 'partner-management', label: 'Partner Management', badge: counts.partners },
  { key: 'reports-analytics', label: 'Reports & Analytics' },
  { key: 'database', label: 'Database' },
  { key: 'calendar-health', label: 'Calendar Health' },
  { key: 'alerts', label: 'Alerts', badge: counts.flagged, badgeColor: 'red' },
  { key: 'partner-preview', label: 'Partner Preview' },
];

const BIZ_CLIENT_ITEMS = [
  { key: 'client-management', label: 'Client Management', disabled: true },
  { key: 'reports', label: 'Reports', disabled: true },
  { key: 'client-preview', label: 'Client Preview', disabled: true },
];

const INTERNAL_DAILY_OPS_ITEMS = [
  { key: 'eod-tracker', label: 'EOD Tracker' },
  { key: 'one-thing', label: 'One Thing' },
  { key: 'time-off', label: 'Time Off' },
];

const INTERNAL_COMPANY_ITEMS = [
  { key: 'finance', label: 'Finance' },
  { key: 'sops', label: 'SOPs' },
  { key: 'alerts', label: 'Alerts' },
];

const INTERNAL_ADMIN_ITEMS = [
  { key: 'settings', label: 'Settings' },
  { key: 'team-directory', label: 'Team Directory' },
];

export default function Sidebar({ activePortal, onPortalChange, activePage, onPageChange, counts, user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <aside
      style={{
        width: '224px',
        flexShrink: 0,
        background: '#080c12',
        borderRight: '1px solid #1a2330',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PortalDropdown
        activePortal={activePortal}
        onSelect={onPortalChange}
        open={dropdownOpen}
        onToggle={() => setDropdownOpen((v) => !v)}
        onClose={() => setDropdownOpen(false)}
      />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activePortal === 'biz' && (
          <>
            <NavSection
              theme="biz"
              dotColor="#c8e060"
              labelColor="#7a9a30"
              label="B2B Partners"
              items={BIZ_PARTNER_ITEMS(counts)}
              activePage={activePage}
              onSelect={onPageChange}
            />
            <div style={{ borderTop: '1px solid #1a2330' }} />
            <NavSection
              theme="biz"
              dotColor="#c084fc"
              labelColor="#8050b0"
              label="B2C Clients"
              tag="TBD"
              items={BIZ_CLIENT_ITEMS}
              activePage={activePage}
              onSelect={onPageChange}
            />
          </>
        )}

        {activePortal === 'internal' && (
          <>
            <NavSection
              theme="internal"
              dotColor="#5a9fd4"
              labelColor="#3a6a90"
              label="Daily Ops"
              items={INTERNAL_DAILY_OPS_ITEMS}
              activePage={activePage}
              onSelect={onPageChange}
            />
            <div style={{ borderTop: '1px solid #1a2330' }} />
            <NavSection
              theme="internal"
              dotColor="#5a9fd4"
              labelColor="#3a6a90"
              label="Company"
              items={INTERNAL_COMPANY_ITEMS}
              activePage={activePage}
              onSelect={onPageChange}
            />
            <div style={{ borderTop: '1px solid #1a2330' }} />
            <NavSection
              theme="internal"
              dotColor="#5a9fd4"
              labelColor="#3a6a90"
              label="Admin"
              items={INTERNAL_ADMIN_ITEMS}
              activePage={activePage}
              onSelect={onPageChange}
            />
          </>
        )}
      </div>

      <UserFooter user={user} />
    </aside>
  );
}

function UserFooter({ user }) {
  const name = user?.name ?? 'Unknown User';
  const role = user?.role ?? 'Member';
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.75rem',
        borderTop: '1px solid #1a2330',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: '50%',
          background: '#1a3050',
          color: '#f0c85a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      >
        {initials || '?'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#e5edf7', fontSize: '0.8rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
        <div style={{ color: '#5a6a80', fontSize: '0.68rem', lineHeight: 1.2 }}>{role}</div>
      </div>
      <button
        onClick={handleSignOut}
        title="Log out"
        style={{ background: 'transparent', color: '#5a6a80', fontSize: '1rem', padding: '0.2rem' }}
      >
        ⏻
      </button>
    </div>
  );
}
