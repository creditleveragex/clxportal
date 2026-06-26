import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import PartnerDashboard from '../../pages/PartnerDashboard.jsx';
import PortalPlaceholder from '../../pages/PortalPlaceholder.jsx';

const DEFAULT_PAGE = { biz: 'partner-management', internal: 'eod-tracker', ai: 'overview' };

const PAGE_LABELS = {
  'partner-management': 'Partner Management',
  'reports-analytics': 'Reports & Analytics',
  database: 'Database',
  'calendar-health': 'Calendar Health',
  alerts: 'Alerts',
  'partner-preview': 'Partner Preview',
  'eod-tracker': 'EOD Tracker',
  'one-thing': 'One Thing',
  'time-off': 'Time Off',
  finance: 'Finance',
  sops: 'SOPs',
  'team-directory': 'Team Directory',
  settings: 'Settings',
  overview: 'Overview',
};

export default function MainLayout({ user }) {
  const [activePortal, setActivePortal] = useState('biz');
  const [activePage, setActivePage] = useState(DEFAULT_PAGE.biz);
  const [search, setSearch] = useState('');
  const [addTrigger, setAddTrigger] = useState(0);
  const [partners, setPartners] = useState([]);

  function handlePortalChange(portal) {
    setActivePortal(portal);
    setActivePage(DEFAULT_PAGE[portal]);
    setSearch('');
  }

  const counts = {
    partners: partners.length,
    flagged: partners.filter((p) => p.flagged_for_review).length,
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        activePortal={activePortal}
        onPortalChange={handlePortalChange}
        activePage={activePage}
        onPageChange={setActivePage}
        counts={counts}
        user={user}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <TopBar
          activePortal={activePortal}
          pageLabel={PAGE_LABELS[activePage] ?? activePage}
          search={search}
          onSearchChange={setSearch}
          primaryAction={
            activePortal === 'biz' && activePage === 'partner-management'
              ? { label: '+ Add Partner', onClick: () => setAddTrigger((n) => n + 1) }
              : null
          }
        />

        <main style={{ padding: '2rem' }}>
          {activePortal === 'biz' && activePage === 'partner-management' && (
            <PartnerDashboard search={search} addTrigger={addTrigger} onPartnersChange={setPartners} />
          )}

          {activePortal === 'biz' && activePage !== 'partner-management' && (
            <PortalPlaceholder
              icon="🚧"
              title={PAGE_LABELS[activePage] ?? activePage}
              subtitle="This section is coming soon."
              accentColor="#f0c85a"
            />
          )}

          {activePortal === 'internal' && (
            <PortalPlaceholder
              icon="🗂️"
              title="CLX Internal"
              subtitle="Team operations hub — daily ops, company resources, and admin tools."
              accentColor="#5a9fd4"
              chips={[
                { key: 'eod-tracker', label: 'EOD Tracker' },
                { key: 'one-thing', label: 'One Thing' },
                { key: 'finance', label: 'Finance' },
                { key: 'sops', label: 'SOPs' },
              ]}
              onChipClick={setActivePage}
            />
          )}

          {activePortal === 'ai' && (
            <PortalPlaceholder
              icon="✨"
              title="CLX AI"
              subtitle="Tools & automations are on the way."
              accentColor="#c084fc"
              chips={[]}
            />
          )}
        </main>
      </div>
    </div>
  );
}
