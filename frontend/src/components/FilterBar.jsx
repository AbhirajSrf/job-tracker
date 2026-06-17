const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export default function FilterBar({ status, onStatusChange, search, onSearchChange, onAddNew }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__filters">
        <input
          type="text"
          className="filter-bar__search"
          placeholder="Search by company or job title…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search applications"
        />

        <div className="filter-bar__statuses">
          <button
            className={`chip ${status === '' ? 'chip--active' : ''}`}
            onClick={() => onStatusChange('')}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`chip ${status === s ? 'chip--active' : ''}`}
              onClick={() => onStatusChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn--primary" onClick={onAddNew}>
        + Add application
      </button>
    </div>
  );
}
