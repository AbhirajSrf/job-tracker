import './StatusTag.css';

const STATUS_CONFIG = {
  Applied: { color: 'var(--color-slate)', bg: '#EEF0F2' },
  Interviewing: { color: 'var(--color-amber)', bg: 'var(--color-amber-soft)' },
  Offer: { color: 'var(--color-sage)', bg: 'var(--color-sage-soft)' },
  Rejected: { color: 'var(--color-clay)', bg: 'var(--color-clay-soft)' },
};

export default function StatusTag({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;

  return (
    <span
      className="status-tag"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span className="status-tag__dot" style={{ backgroundColor: config.color }} />
      {status}
    </span>
  );
}
