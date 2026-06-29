export const CALENDAR_STATUS_COLORS = {
  Active: 'var(--clx-active)',
  Warm: 'var(--clx-accent)',
  Cold: 'var(--clx-text-secondary)',
  Dead: 'var(--clx-churned)',
  'Never booked': 'var(--clx-text-secondary)',
};

export function Card({ title, children }) {
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

export function Field({ label, value }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--clx-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ color: 'var(--clx-text)' }}>{value}</div>
    </div>
  );
}

export function CalendarStatusBadge({ status, label }) {
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

export function CalendarHealthCard({ calendarHealth }) {
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

export function BookingStatsCard({ stats, title = 'Booking Stats' }) {
  return (
    <Card title={title}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
        <StatBox label="Total Bookings" value={stats.total} />
        <StatBox label="Shows" value={stats.shows} color="var(--clx-active)" />
        <StatBox label="No Shows" value={stats.noShows} color="var(--clx-churned)" />
        <StatBox label="Qualified" value={stats.qualified} color="var(--clx-accent)" />
      </div>
    </Card>
  );
}

export function StatBox({ label, value, color = 'var(--clx-text)' }) {
  return (
    <div>
      <div style={{ fontSize: '1.6rem', fontFamily: "'Bebas Neue', sans-serif", color }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--clx-text-secondary)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

export function computeBookingStats(bookings) {
  return {
    total: bookings.length,
    shows: bookings.filter((b) => b.show_no_show === 'SHOWED').length,
    noShows: bookings.filter((b) => b.show_no_show === 'NO SHOW').length,
    qualified: bookings.filter((b) => b.qualified && b.qualified.trim() !== '').length,
  };
}

export function LeadsTable({ bookings, emptyMessage = 'No leads booked under this partner yet.' }) {
  if (bookings.length === 0) {
    return <div style={{ color: 'var(--clx-text-secondary)', padding: '2rem 0' }}>{emptyMessage}</div>;
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
