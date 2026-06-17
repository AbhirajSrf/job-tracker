import StatusTag from './StatusTag';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function ApplicationDetail({ application, onClose, onEdit }) {
  const { company_name, job_title, job_type, status, applied_date, notes, created_at, updated_at } = application;

  return (
    <div className="app-detail">
      <div className="app-detail__header">
        <div>
          <h3>{company_name}</h3>
          <p className="app-detail__subtitle">{job_title} · {job_type}</p>
        </div>
        <StatusTag status={status} />
      </div>

      <dl className="app-detail__facts">
        <div>
          <dt>Applied on</dt>
          <dd>{formatDate(applied_date)}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDateTime(created_at)}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDateTime(updated_at)}</dd>
        </div>
      </dl>

      <div className="app-detail__notes">
        <dt>Notes</dt>
        <p>{notes || 'No notes added yet.'}</p>
      </div>

      <div className="app-detail__actions">
        <button className="btn btn--ghost" onClick={onClose}>Close</button>
        <button className="btn btn--primary" onClick={() => onEdit(application)}>Edit application</button>
      </div>
    </div>
  );
}
