import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import HealthBadge from '../components/HealthBadge.jsx';

export default function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    supabase
      .from('b2b_owners')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (!active) return;
        if (fetchError) {
          setError(fetchError.message);
          setPartner(null);
        } else {
          setPartner(data);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div style={{ color: 'var(--clx-text-secondary)' }}>Loading partner...</div>;
  }

  if (error || !partner) {
    return <div style={{ color: 'var(--clx-churned)' }}>{error || 'Partner not found.'}</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/business/b2b/partners')}
        style={{
          background: 'transparent',
          color: 'var(--clx-text-secondary)',
          border: '1px solid var(--clx-border)',
          padding: '0.35rem 0.75rem',
          fontSize: '0.8rem',
          marginBottom: '1.5rem',
        }}
      >
        ← Back to Partners
      </button>

      <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--clx-text-secondary)' }}>
        {partner.business_name || 'PARTNER DETAIL'}
      </h2>

      <div
        style={{
          background: 'var(--clx-surface)',
          border: '1px solid var(--clx-border)',
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1rem',
          maxWidth: '700px',
        }}
      >
        <Field label="Contact" value={[partner.first_name, partner.last_name].filter(Boolean).join(' ') || '—'} />
        <Field label="Email" value={partner.email || '—'} />
        <Field label="Phone" value={partner.phone || '—'} />
        <Field label="Health" value={<HealthBadge status={partner.health_status} />} />
        <Field
          label="Flagged"
          value={
            partner.flagged_for_review ? (
              <span style={{ color: 'var(--clx-accent)' }}>⚑ Flagged{partner.flag_reason ? ` — ${partner.flag_reason}` : ''}</span>
            ) : (
              '—'
            )
          }
        />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--clx-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ color: 'var(--clx-text)' }}>{value}</div>
    </div>
  );
}
