import { useEffect, useMemo, useState } from 'react';
import { usePartners } from '../hooks/usePartners.js';
import PartnerFilterBar from '../components/PartnerFilterBar.jsx';
import PartnerTable from '../components/PartnerTable.jsx';
import PartnerFormModal from '../components/PartnerFormModal.jsx';
import FlagModal from '../components/FlagModal.jsx';

const PAGE_SIZE = 20;

export default function PartnerDashboard({ search: externalSearch, addTrigger, onPartnersChange }) {
  const { partners, loading, error, upsertPartner, setFlag } = usePartners();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingPartner, setEditingPartner] = useState(undefined);
  const [flaggingPartner, setFlaggingPartner] = useState(null);

  useEffect(() => {
    if (externalSearch !== undefined) setSearch(externalSearch);
  }, [externalSearch]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (addTrigger) setEditingPartner(null);
  }, [addTrigger]);

  useEffect(() => {
    onPartnersChange?.(partners);
  }, [partners, onPartnersChange]);

  const filteredPartners = useMemo(() => {
    const term = search.trim().toLowerCase();
    return partners.filter((p) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'flagged' ? p.flagged_for_review : p.health_status === filter);
      const matchesSearch =
        !term ||
        [p.business_name, p.first_name, p.last_name, p.email]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });
  }, [partners, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPartners.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pagedPartners = filteredPartners.slice(start, start + PAGE_SIZE);
  const rangeEnd = Math.min(start + PAGE_SIZE, filteredPartners.length);
  const rangeLabel =
    filteredPartners.length === 0
      ? '0 partners'
      : `${start + 1}–${rangeEnd} of ${filteredPartners.length} partner${filteredPartners.length === 1 ? '' : 's'}`;

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

      <PartnerFilterBar activeFilter={filter} onFilterChange={setFilter} resultCount={rangeLabel} />

      {error && <div style={{ color: 'var(--clx-churned)', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div style={{ color: 'var(--clx-text-secondary)' }}>Loading partners...</div>
      ) : (
        <>
          <PartnerTable partners={pagedPartners} onEdit={setEditingPartner} onFlag={setFlaggingPartner} />
          {totalPages > 1 && (
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} rangeLabel={rangeLabel} />
          )}
        </>
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

function pageItems(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (page >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', page - 1, page, page + 1, '...', total];
}

function Pagination({ page, totalPages, onPageChange, rangeLabel }) {
  const items = pageItems(page, totalPages);
  const cellBase = { width: 28, height: 28, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
  const btnBase = { ...cellBase, background: 'transparent', border: 'none', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: '1rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        padding: '8px 12px',
      }}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnBase, opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? 'default' : 'pointer' }}
      >
        <i className="ti ti-chevron-left" style={{ fontSize: 13 }} />
      </button>

      {items.map((item, i) =>
        item === '...' ? (
          <div key={`ellipsis-${i}`} style={{ ...cellBase, color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>
            …
          </div>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            style={{
              ...btnBase,
              ...(item === page ? { background: '#c8e060', color: '#0a1400', fontWeight: 700 } : {}),
            }}
          >
            {item}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...btnBase, opacity: page === totalPages ? 0.3 : 1, cursor: page === totalPages ? 'default' : 'pointer' }}
      >
        <i className="ti ti-chevron-right" style={{ fontSize: 13 }} />
      </button>

      <div style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 8, borderLeft: '1px solid var(--border-color)' }}>
        {rangeLabel}
      </div>
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
