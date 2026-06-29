import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import HealthBadge from '../components/HealthBadge.jsx';
import {
  Card,
  Field,
  CalendarHealthCard,
  BookingStatsCard,
  LeadsTable,
  computeBookingStats,
} from '../components/PartnerDetailShared.jsx';

export default function MyStatusPage() {
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
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !userData?.user?.email) {
        setError(userError?.message || 'Unable to load your session.');
        setLoading(false);
        return;
      }

      const { data: ownerData, error: ownerError } = await supabase
        .from('b2b_owners')
        .select('*')
        .eq('email', userData.user.email)
        .maybeSingle();

      if (!active) return;

      if (ownerError) {
        setError(ownerError.message);
        setLoading(false);
        return;
      }

      setPartner(ownerData ?? null);

      if (!ownerData?.calendar_name) {
        setCalendarHealth(null);
        setBookings([]);
        setLoading(false);
        return;
      }

      const [{ data: healthData }, { data: bookingData }] = await Promise.all([
        supabase
          .from('b2b_calendar_health')
          .select('*')
          .eq('calendar', ownerData.calendar_name)
          .maybeSingle(),
        supabase
          .from('b2b_bookings')
          .select('*')
          .eq('calendar', ownerData.calendar_name)
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
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--clx-text-secondary)' }}>Loading your status...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--clx-churned)' }}>{error}</div>;
  }

  if (!partner) {
    return (
      <div style={{ color: 'var(--clx-text-secondary)' }}>
        Your account isn't set up yet. Contact your CLX admin.
      </div>
    );
  }

  const stats = computeBookingStats(bookings);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--clx-text-secondary)', margin: 0 }}>
            {partner.business_name || 'MY STATUS'}
          </h2>
          <HealthBadge status={partner.health_status} />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <MyAccountCard partner={partner} />
        <CalendarHealthCard calendarHealth={calendarHealth} />
        <BookingStatsCard stats={stats} title="My Booking Stats" />
      </div>

      <LeadsTable bookings={bookings} />
    </div>
  );
}

function MyAccountCard({ partner }) {
  const name = [partner.first_name, partner.last_name].filter(Boolean).join(' ') || '—';
  const bookingLink = partner.booking_link;
  const truncatedLink = bookingLink && bookingLink.length > 35 ? `${bookingLink.slice(0, 35)}…` : bookingLink;

  return (
    <Card title="My Account">
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '1.1rem', fontFamily: "'Bebas Neue', sans-serif", color: 'var(--clx-text)' }}>
          {partner.business_name || '—'}
        </div>
      </div>
      <Field label="Contact" value={name} />
      <Field label="Email" value={partner.email || '—'} />
      <Field label="Phone" value={partner.phone || '—'} />
      <Field
        label="Booking Link"
        value={
          bookingLink ? (
            <a href={bookingLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clx-accent)' }}>
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
