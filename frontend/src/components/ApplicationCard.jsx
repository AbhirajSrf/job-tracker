import StatusTag from './StatusTag';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ApplicationCard({ application, onView, onEdit, onDelete }) {
  const { company_name, job_title, job_type, status, applied_date } = application;

  return (
    <div className="app-card">
      <div className="app-card__main" onClick={() => onView(application)}>
        <div className="app-card__primary">
          <h3 className="app-card__company">{company_name}</h3>
          <span className="app-card__title">{job_title}</span>
        </div>
        <div className="app-card__meta">
          <span className="app-card__type">{job_type}</span>
          <span className="app-card__date">Applied {formatDate(applied_date)}</span>
        </div>
      </div>

      <div className="app-card__side">
        <StatusTag status={status} />
        <div className="app-card__actions">
          <button className="icon-btn" title="View" aria-label="View application" onClick={() => onView(application)}>
            view
          </button>
          <button className="icon-btn" title="Edit" aria-label="Edit application" onClick={() => onEdit(application)}>
            edit
          </button>
          <button className="icon-btn icon-btn--danger" title="Delete" aria-label="Delete application" onClick={() => onDelete(application)}>
            delete
          </button>
        </div>
      </div>
    </div>
  );
}
