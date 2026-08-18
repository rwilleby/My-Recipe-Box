import "./AdminPinDialog.css";

export default function AdminPinDialog({
  adminPin,
  adminPinError,
  inputRef,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="adminPinOverlay" role="presentation" onMouseDown={onClose}>
      <section
        className="adminPinDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-pin-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="adminPinClose" aria-label="Close Admin PIN window" onClick={onClose}>
          ×
        </button>
        <h2 id="admin-pin-title">Admin Access</h2>
        <p>Enter the four-digit Admin PIN.</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="admin-pin-input">PIN</label>
          <input
            ref={inputRef}
            id="admin-pin-input"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            maxLength={4}
            value={adminPin}
            aria-invalid={Boolean(adminPinError)}
            aria-describedby={adminPinError ? "admin-pin-error" : undefined}
            onChange={onChange}
          />
          {adminPinError && (
            <p id="admin-pin-error" className="adminPinError" role="alert">
              {adminPinError}
            </p>
          )}
          <div className="adminPinActions">
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={adminPin.length !== 4}>Unlock Admin</button>
          </div>
        </form>
      </section>
    </div>
  );
}
