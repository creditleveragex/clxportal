import { useState } from 'react';
import Modal from './Modal.jsx';

export default function FlagModal({ partner, onConfirm, onClose }) {
  const isFlagged = partner.flagged_for_review;
  const [reason, setReason] = useState(partner.flag_reason ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    setSaving(true);
    setError(null);
    try {
      await onConfirm(!isFlagged, reason);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={isFlagged ? 'Unflag Partner' : 'Flag Partner for Review'} onClose={onClose}>
      <p style={{ color: 'var(--clx-text-secondary)', fontSize: '0.9rem' }}>
        {isFlagged
          ? `Remove the review flag from ${partner.business_name}?`
          : `Flag ${partner.business_name} for review by the team.`}
      </p>

      {!isFlagged && (
        <label style={{ fontSize: '0.8rem', color: 'var(--clx-text-secondary)', display: 'block', marginTop: '0.75rem' }}>
          Reason
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
          />
        </label>
      )}

      {error && <div style={{ color: 'var(--clx-churned)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button
          onClick={handleConfirm}
          disabled={saving}
          style={{
            background: 'var(--clx-accent)',
            color: 'var(--clx-bg)',
            padding: '0.6rem 1.25rem',
            fontWeight: 700,
            flex: 1,
          }}
        >
          {saving ? 'Saving...' : isFlagged ? 'Unflag' : 'Flag for Review'}
        </button>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid var(--clx-border)',
            color: 'var(--clx-text)',
            padding: '0.6rem 1.25rem',
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
