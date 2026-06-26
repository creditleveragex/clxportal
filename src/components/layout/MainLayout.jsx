import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import PartnerDashboard from '../../pages/PartnerDashboard.jsx';
import PlaceholderPage from '../../pages/PlaceholderPage.jsx';
import { useUserRole } from '../../hooks/useUserRole.js';

const DEFAULT_PATH = { biz: '/business/b2b/partners', internal: '/internal/eod' };

const ADMIN_ONLY_B2B_PATHS = [
  '/business/b2b/database',
  '/business/b2b/reports',
  '/business/b2b/calendar-health',
  '/business/b2b/partner-preview',
];

const PAGE_LABELS = {
  '/business/b2b/partners': 'Partner Management',
  '/business/b2b/reports': 'Reports & Analytics',
  '/business/b2b/database': 'Database',
  '/business/b2b/calendar-health': 'Calendar Health',
  '/business/b2b/alerts': 'Alerts',
  '/business/b2b/partner-preview': 'Partner Preview',
  '/business/b2b/my-status': 'My Status',
  '/business/b2b/my-commissions': 'My Commissions',
  '/business/b2b/my-alerts': 'My Alerts',
  '/internal/eod': 'EOD Tracker',
  '/internal/one-thing': 'One Thing',
  '/internal/time-off': 'Time Off',
  '/internal/finance': 'Finance',
  '/internal/sops': 'SOPs',
  '/internal/alerts': 'Alerts',
  '/internal/settings': 'Settings',
  '/internal/team-directory': 'Team Directory',
};

export default function MainLayout({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isPartner } = useUserRole();
  const [search, setSearch] = useState('');
  const [addTrigger, setAddTrigger] = useState(0);
  const [partners, setPartners] = useState([]);

  const activePortal = location.pathname.startsWith('/internal') ? 'internal' : 'biz';
  const pageLabel =
    PAGE_LABELS[location.pathname] ?? (location.pathname.startsWith('/business/b2c') ? 'B2C Clients' : 'Overview');

  function handlePortalChange(portal) {
    setSearch('');
    navigate(DEFAULT_PATH[portal] ?? '/');
  }

  const counts = {
    partners: partners.length,
    flagged: partners.filter((p) => p.flagged_for_review).length,
  };

  const isBlockedForPartner =
    isPartner && (location.pathname.startsWith('/internal') || ADMIN_ONLY_B2B_PATHS.includes(location.pathname));

  if (isBlockedForPartner) {
    return <Navigate to="/business/b2b/my-status" replace />;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        activePortal={activePortal}
        onPortalChange={handlePortalChange}
        counts={counts}
        user={user}
        isAdmin={isAdmin}
        isPartner={isPartner}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <TopBar
          activePortal={activePortal}
          pageLabel={pageLabel}
          search={search}
          onSearchChange={setSearch}
          primaryAction={
            location.pathname === '/business/b2b/partners'
              ? { label: '+ Add Partner', onClick: () => setAddTrigger((n) => n + 1) }
              : null
          }
        />

        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/business/b2b/partners" replace />} />
            <Route
              path="/business/b2b/partners"
              element={<PartnerDashboard search={search} addTrigger={addTrigger} onPartnersChange={setPartners} />}
            />
            <Route
              path="/business/b2b/reports"
              element={<PlaceholderPage title="Reports & Analytics" accentColor="#f0c85a" />}
            />
            <Route path="/business/b2b/database" element={<PlaceholderPage title="Database" accentColor="#f0c85a" />} />
            <Route
              path="/business/b2b/calendar-health"
              element={<PlaceholderPage title="Calendar Health" accentColor="#f0c85a" />}
            />
            <Route path="/business/b2b/alerts" element={<PlaceholderPage title="Alerts" accentColor="#f0c85a" />} />
            <Route
              path="/business/b2b/partner-preview"
              element={<PlaceholderPage title="Partner Preview" accentColor="#f0c85a" />}
            />
            <Route
              path="/business/b2b/my-status"
              element={<PlaceholderPage title="My Status" accentColor="#f0c85a" />}
            />
            <Route
              path="/business/b2b/my-commissions"
              element={<PlaceholderPage title="My Commissions" accentColor="#f0c85a" />}
            />
            <Route
              path="/business/b2b/my-alerts"
              element={<PlaceholderPage title="My Alerts" accentColor="#f0c85a" />}
            />
            <Route
              path="/business/b2c/*"
              element={<PlaceholderPage title="B2C Clients" subtitle="Coming soon — TBD" accentColor="#c084fc" />}
            />
            <Route path="/internal/eod" element={<PlaceholderPage title="EOD Tracker" accentColor="#5a9fd4" />} />
            <Route path="/internal/one-thing" element={<PlaceholderPage title="One Thing" accentColor="#5a9fd4" />} />
            <Route path="/internal/time-off" element={<PlaceholderPage title="Time Off" accentColor="#5a9fd4" />} />
            <Route path="/internal/finance" element={<PlaceholderPage title="Finance" accentColor="#5a9fd4" />} />
            <Route path="/internal/sops" element={<PlaceholderPage title="SOPs" accentColor="#5a9fd4" />} />
            <Route path="/internal/alerts" element={<PlaceholderPage title="Alerts" accentColor="#5a9fd4" />} />
            <Route path="/internal/settings" element={<PlaceholderPage title="Settings" accentColor="#5a9fd4" />} />
            <Route
              path="/internal/team-directory"
              element={<PlaceholderPage title="Team Directory" accentColor="#5a9fd4" />}
            />
            <Route path="*" element={<Navigate to="/business/b2b/partners" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
