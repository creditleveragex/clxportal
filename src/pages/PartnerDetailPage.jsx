import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import HealthBadge from '../components/HealthBadge.jsx';

const CALENDAR_STATUS_COLORS = {
  Active: 'var(--clx-active)',
  Warm: 'var(--clx-accent)',
  Cold: 'var(--clx-text-secondary)',
  Dead: 'var(--clx-churned)',
  'Never booked': 'var(--clx-text-secondary)',
};

export default function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [calendarHealth, setCalendarHealth] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    async function load() {
      const { data: ownerData, error: ownerError } = await supabase
        .from('b2b_owners')
        .select('*')
        .eq('id', id)
        .single();

      if (!active) return;

      if (ownerError) {
        setError(ownerError.message);
        setLoading(false);
        return;
      }

      setPartner(ownerData);

      const [{ data: healthData }, { data: bookingData }] = await Promise.all([
        supabase
          .from('b2b_calendar_health')
          .select('*')
          .eq('calendar', ownerData.business_name)
          .maybeSingle(),
        supabase
          .from('b2b_bookings')
          .select('*')
          .eq('calendar', ownerData.business_name)
          .order('date_of_booking', { ascending: false }),
      ]);

      if (!active) return;

      setCalendarHealth(healthData ?? null);
      setBookings(bookingData ?? []);
      setLoading(false);
    }

    load();

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

  const stats = {
    total: bookings.length,
    shows: bookings.filter((b) => b.show_no_show === 'SHOWED').length,
    noShows: bookings.filter((b) => b.show_no_show === 'NO SHOW').length,
    qualified: bookings.filter((b) => b.qualified && b.qualified.trim() !== '').length,
  };

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

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--clx-text-secondary)', margin: 0 }}>
            {partner.business_name || 'PARTNER DETAIL'}
          </h2>
          <HealthBadge status={partner.health_status} />
          {calendarHealth?.status && <CalendarStatusBadge status={calendarHealth.status} label="Calendar" />}
          {partner.flagged_for_review && (
            <span
              style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                border: '1px solid var(--clx-churned)',
                color: 'var(--clx-churned)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Flagged
            </span>
          )}
        </div>
        {partner.flagged_for_review && partner.flag_reason && (
          <div style={{ color: 'var(--clx-text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            {partner.flag_reason}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <ContactCard partner={partner} />
        <CalendarHealthCard calendarHealth={calendarHealth} />
        <BookingStatsCard stats={stats} />
      </div>

      <LeadsTable bookings={bookings} />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'var(--clx-surface)', border: '1px solid var(--clx-border)', padding: '1.25rem' }}>
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--clx-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--clx-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ color: 'var(--clx-text)' }}>{value}</div>
    </div>
  );
}

function ContactCard({ partner }) {
  const name = [partner.first_name, partner.last_name].filter(Boolean).join(' ') || '—';
  const bookingLink = partner.booking_link;
  const truncatedLink = bookingLink && bookingLink.length > 35 ? `${bookingLink.slice(0, 35)}…` : bookingLink;

  return (
    <Card title="Contact">
      <Field label="Name" value={name} />
      <Field label="Email" value={partner.email || '—'} />
      <Field label="Phone" value={partner.phone || '—'} />
      <Field
        label="Booking Link"
        value={
          bookingLink ? (
            <a
              href={bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--clx-accent)' }}
            >
              {truncatedLink}
            </a>
          ) : (
            '—'
          )
        }
      />
    </Card>
  );
}

function CalendarStatusBadge({ status, label }) {
  const color = CALENDAR_STATUS_COLORS[status] ?? 'var(--clx-text-secondary)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.6rem',
        border: `1px solid ${color}`,
        color,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {label && <span style={{ opacity: 0.7 }}>{label}:</span>}
      {status}
    </span>
  );
}

function CalendarHealthCard({ calendarHealth }) {
  if (!calendarHealth) {
    return (
      <Card title="Calendar Health">
        <div style={{ color: 'var(--clx-text-secondary)' }}>No calendar data yet</div>
      </Card>
    );
  }

  const daysSinceNum = Number(calendarHealth.days_since);
  const isOverdue = !Number.isNaN(daysSinceNum) && daysSinceNum > 90;

  return (
    <Card title="Calendar Health">
      <Field label="Status" value={<CalendarStatusBadge status={calendarHealth.status} />} />
      <Field label="Last booked" value={calendarHealth.last_booked || '—'} />
      <Field
        label="Days since"
        value={
          <span style={{ color: isOverdue ? 'var(--clx-churned)' : 'var(--clx-text)' }}>
            {calendarHealth.days_since || '—'}
          </span>
        }
      />
      <Field
        label="Action needed"
        value={<span style={{ color: 'var(--clx-text-secondary)' }}>{calendarHealth.action_needed || '—'}</span>}
      />
    </Card>
  );
}

function BookingStatsCard({ stats }) {
  return (
    <Card title="Booking Stats">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
        <StatBox label="Total Bookings" value={stats.total} />
        <StatBox label="Shows" value={stats.shows} color="var(--clx-active)" />
        <StatBox label="No Shows" value={stats.noShows} color="var(--clx-churned)" />
        <StatBox label="Qualified" value={stats.qualified} color="var(--clx-accent)" />
      </div>
    </Card>
  );
}

function StatBox({ label, value, color = 'var(--clx-text)' }) {
  return (
    <div>
      <div style={{ fontSize: '1.6rem', fontFamily: "'Bebas Neue', sans-serif", color }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--clx-text-secondary)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function LeadsTable({ bookings }) {
  if (bookings.length === 0) {
    return (
      <div style={{ color: 'var(--clx-text-secondary)', padding: '2rem 0' }}>
        No leads booked under this partner yet.
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--clx-border)' }}>
          {['Lead name', 'Date', 'Setter', 'Closer', 'Show/No show', 'Qualified', 'Signed', 'Funded'].map((h) => (
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
        {bookings.map((b) => (
          <tr key={b.id} style={{ borderBottom: '1px solid var(--clx-border)' }}>
            <td style={{ padding: '0.75rem 0.5rem' }}>{b.lead_name || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--clx-text-secondary)' }}>{b.date_of_booking || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem' }}>{b.setter_calendar_name || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem' }}>{b.closer_booked || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem' }}>
              {b.show_no_show ? (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.15rem 0.5rem',
                    border: `1px solid ${b.show_no_show === 'SHOWED' ? 'var(--clx-active)' : 'var(--clx-churned)'}`,
                    color: b.show_no_show === 'SHOWED' ? 'var(--clx-active)' : 'var(--clx-churned)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {b.show_no_show}
                </span>
              ) : (
                '—'
              )}
            </td>
            <td style={{ padding: '0.75rem 0.5rem' }}>
              {b.qualified && b.qualified.trim() !== '' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'var(--clx-active)',
                      display: 'inline-block',
                    }}
                  />
                  {b.qualified}
                </span>
              ) : (
                <span style={{ color: 'var(--clx-text-secondary)' }}>—</span>
              )}
            </td>
            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--clx-text-secondary)' }}>{b.signed_date || '—'}</td>
            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--clx-text-secondary)' }}>{b.date_funded || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
