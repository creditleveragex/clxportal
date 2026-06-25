export default function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,22,40,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--clx-surface)',
          border: '1px solid var(--clx-border)',
          width: '420px',
          maxWidth: '90vw',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--clx-accent)' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--clx-text-secondary)', fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
