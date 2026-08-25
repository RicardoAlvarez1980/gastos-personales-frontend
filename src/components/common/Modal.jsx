export default function Modal({ title, icon, tone = 'edit', onCancel, onConfirm, confirmLabel = 'Confirmar', children }) {
  return <div className="v2-modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onCancel?.()}>
    <div className={`v2-modal v2-modal-${tone}`} role="dialog" aria-modal="true" aria-labelledby="v2-modal-title">
      <div className="v2-modal-top"><span className="v2-modal-icon" aria-hidden="true">{icon}</span><button type="button" className="v2-modal-close" onClick={onCancel} aria-label="Cerrar">×</button></div>
      <h3 id="v2-modal-title">{title}</h3>
      <div className="v2-modal-body">{children}</div>
      <div className="v2-modal-actions"><button type="button" className="v2-secondary-button" onClick={onCancel}>Cancelar</button><button type="button" className="v2-primary-button" onClick={onConfirm}>{confirmLabel}</button></div>
    </div>
  </div>;
}
