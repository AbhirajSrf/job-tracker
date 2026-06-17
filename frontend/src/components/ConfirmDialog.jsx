export default function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  return (
    <div className="confirm-dialog">
      <p>{message}</p>
      <div className="confirm-dialog__actions">
        <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button className={danger ? 'btn btn--danger' : 'btn btn--primary'} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
