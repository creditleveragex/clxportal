import { useMemo, useState } from 'react';
import { usePartners } from '../hooks/usePartners.js';
import PartnerFilterBar from '../components/PartnerFilterBar.jsx';
import PartnerTable from '../components/PartnerTable.jsx';
import PartnerFormModal from '../components/PartnerFormModal.jsx';
import FlagModal from '../components/FlagModal.jsx';

export default function PartnerDashboard() {
  const { partners, loading, error, upsertPartner, setFlag } = usePartners();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingPartner, setEditingPartner] = useState(undefined);
  const [flaggingPartner, setFlaggingPartner] = useState(null);

  const filteredPartners = useMemo(() => {
    const term = search.trim().toLowerCase();
    return partners.filter((p) => {
      const matchesFilter = filter === 'all' || p.health_status === filter;
      const matchesSearch =
        !term ||
        [p.business_name, p.first_name, p.last_name, p.email]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });
  }, [partners, filter, search]);

  const counts = useMemo(
    () => ({
      total: partners.length,
      active: partners.filter((p) => p.health_status === 'active').length,
      atRisk: partners.filter((p) => p.health_status === 'at-risk').length,
      churned: partners.filter((p) => p.health_status === 'churned').length,
      flagged: partners.filter((p) => p.flagged_for_review).length,
    }),
    [partners],
  );

  return (
    <div>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--clx-text-secondary)' }}>
        PARTNER MANAGEMENT
      </h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard label="Total Partners" value={counts.total} />
        <StatCard label="Active" value={counts.active} color="var(--clx-active)" />
        <StatCard label="At Risk" value={counts.atRisk} color="var(--clx-at-risk)" />
        <StatCard label="Churned" value={counts.churned} color="var(--clx-churned)" />
        <StatCard label="Flagged" value={counts.flagged} color="var(--clx-accent)" />
      </div>

      <PartnerFilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        onAddNew={() => setEditingPartner(null)}
      />

      {error && <div style={{ color: 'var(--clx-churned)', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div style={{ color: 'var(--clx-text-secondary)' }}>Loading partners...</div>
      ) : (
        <PartnerTable partners={filteredPartners} onEdit={setEditingPartner} onFlag={setFlaggingPartner} />
      )}

      {editingPartner !== undefined && (
        <PartnerFormModal
          partner={editingPartner}
          onSave={(form) => upsertPartner(form)}
          onClose={() => setEditingPartner(undefined)}
        />
      )}

      {flaggingPartner && (
        <FlagModal
          partner={flaggingPartner}
          onConfirm={(flagged, reason) => setFlag(flaggingPartner.id, flagged, reason)}
          onClose={() => setFlaggingPartner(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'var(--clx-text)' }) {
  return (
    <div
      style={{
        background: 'var(--clx-surface)',
        border: '1px solid var(--clx-border)',
        padding: '1rem 1.5rem',
        minWidth: '140px',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: 'var(--clx-text-secondary)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontFamily: "'Bebas Neue', sans-serif", color }}>{value}</div>
    </div>
  );
}
