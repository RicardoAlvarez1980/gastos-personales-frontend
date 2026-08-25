export default function ModalV2({ title, children, onConfirm, onCancel, confirmLabel = 'Confirmar' }) {
  return <div className="v2-modal-backdrop" role="presentation">
    <div className="v2-modal" role="dialog" aria-modal="true" aria-labelledby="v2-modal-title">
      <h3 id="v2-modal-title">{title}</h3>
      <div className="v2-modal-body">{children}</div>
      <div className="v2-modal-actions"><button className="v2-secondary-button" onClick={onCancel}>Cancelar</button><button className="v2-primary-button" onClick={onConfirm}>{confirmLabel}</button></div>
    </div>
  </div>;
}
