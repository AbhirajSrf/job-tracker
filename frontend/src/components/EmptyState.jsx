export default function EmptyState({ hasFilters, onAddNew, onClearFilters }) {
  if (hasFilters) {
    return (
      <div className="empty-state">
        <h3>Nothing matches that search</h3>
        <p>No applications fit the current filter. Try a different status or search term.</p>
        <button className="btn btn--ghost" onClick={onClearFilters}>Clear filters</button>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <h3>Your tracker is empty</h3>
      <p>Log the first role you've applied to — you'll thank yourself when the follow-ups start piling up.</p>
      <button className="btn btn--primary" onClick={onAddNew}>+ Add your first application</button>
    </div>
  );
}
