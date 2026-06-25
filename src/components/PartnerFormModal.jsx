import { useState } from 'react';
import Modal from './Modal.jsx';

const EMPTY_FORM = {
  business_name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  booking_link: '',
  health_status: 'active',
  notes: '',
};

export default function PartnerFormModal({ partner, onSave, onClose }) {
  const [form, setForm] = useState(() => (partner ? { ...EMPTY_FORM, ...partner } : EMPTY_FORM));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={partner ? 'Edit Partner' : 'Add Partner'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Field label="Business Name" value={form.business_name} onChange={(v) => update('business_name', v)} required />
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Field label="First Name" value={form.first_name} onChange={(v) => update('first_name', v)} />
          <Field label="Last Name" value={form.last_name} onChange={(v) => update('last_name', v)} />
        </div>
        <Field label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} />
        <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} />
        <Field label="Booking Link" value={form.booking_link} onChange={(v) => update('booking_link', v)} />

        <label style={{ fontSize: '0.8rem', color: 'var(--clx-text-secondary)' }}>
          Health Status
          <select
            value={form.health_status}
            onChange={(e) => update('health_status', e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
          >
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
            <option value="churned">Churned</option>
          </select>
        </label>

        <label style={{ fontSize: '0.8rem', color: 'var(--clx-text-secondary)' }}>
          Notes
          <textarea
            value={form.notes ?? ''}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
          />
        </label>

        {error && <div style={{ color: 'var(--clx-churned)', fontSize: '0.85rem' }}>{error}</div>}

        <button
          type="submit"
          disabled={saving}
          style={{
            background: 'var(--clx-accent)',
            color: 'var(--clx-bg)',
            padding: '0.6rem',
            fontWeight: 700,
            marginTop: '0.5rem',
          }}
        >
          {saving ? 'Saving...' : 'Save Partner'}
        </button>
      </form>
    </Modal>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label style={{ fontSize: '0.8rem', color: 'var(--clx-text-secondary)', flex: 1 }}>
      {label}
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
      />
    </label>
  );
}
