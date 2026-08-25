import { useState } from 'react';
import ModalV2 from '../common/ModalV2';

const meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
function importe(value) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value) || 0); }
function nombreServicio(nombre, id) { if (!nombre) return `Servicio #${id}`; return nombre.toLowerCase().split(/[\s_-]+/).filter(Boolean).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' '); }

export default function ListadoGastosV2({ anio, mes, gastos, loading, error, onEliminar, onEditar }) {
  const [gastoEliminar, setGastoEliminar] = useState(null);
  const [gastoEditar, setGastoEditar] = useState(null);
  const [nuevoImporte, setNuevoImporte] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  const abrirEdicion = (gasto) => { setErrorAccion(''); setNuevoImporte(String(gasto.importe ?? '')); setGastoEditar(gasto); };
  const confirmarEdicion = async () => {
    if (!gastoEditar || !onEditar || nuevoImporte === '' || Number(nuevoImporte) < 0) return;
    setEditando(true); setErrorAccion('');
    const ok = await onEditar(gastoEditar, nuevoImporte);
    setEditando(false);
    if (ok) setGastoEditar(null); else setErrorAccion('No se pudo actualizar el importe. Revisá el mensaje de error en el listado.');
  };
  const confirmarEliminacion = async () => {
    if (!gastoEliminar || !onEliminar) return;
    setEliminando(true); setErrorAccion('');
    const ok = await onEliminar(gastoEliminar.id);
    setEliminando(false);
    if (ok) setGastoEliminar(null); else setErrorAccion('No se pudo eliminar el gasto. Revisá el mensaje de error en el listado.');
  };

  return <section className="v2-gastos-panel">
    <div className="v2-section-heading"><div><span className="v2-eyebrow">GASTOS REGISTRADOS</span><h2>{meses[Number(mes)] || 'MES'} {anio || ''}</h2></div><span className="v2-count">{gastos.length} registro{gastos.length === 1 ? '' : 's'}</span></div>
    {loading && <div className="v2-state">Cargando gastos…</div>}
    {!loading && error && <div className="v2-state v2-state-error">{error}</div>}
    {!loading && !error && gastos.length === 0 && <div className="v2-empty">No hay gastos registrados para este período.</div>}
    {!loading && !error && gastos.length > 0 && <div className="v2-table-wrap"><table className="v2-table"><thead><tr><th>Servicio</th><th>Importe</th><th className="v2-actions-head">Acciones</th></tr></thead><tbody>{gastos.map((gasto) => <tr key={gasto.id}><td>{nombreServicio(gasto.servicios?.nombre || gasto.servicio_nombre, gasto.servicio_id)}</td><td>{importe(gasto.importe)}</td><td className="v2-row-actions"><button type="button" onClick={() => abrirEdicion(gasto)} title="Editar importe">✎</button><button type="button" onClick={() => { setErrorAccion(''); setGastoEliminar(gasto); }} title="Eliminar gasto">×</button></td></tr>)}</tbody></table></div>}
    {gastoEditar && <ModalV2 title="Editar importe" icon="✎" tone="edit" onCancel={() => !editando && setGastoEditar(null)} onConfirm={confirmarEdicion} confirmLabel={editando ? 'Guardando…' : 'Guardar cambios'}><div className="v2-modal-context"><strong>{nombreServicio(gastoEditar.servicios?.nombre || gastoEditar.servicio_nombre, gastoEditar.servicio_id)}</strong><span>{meses[Number(gastoEditar.mes)] || ''} {gastoEditar.año}</span></div><label className="v2-edit-label"><span>Importe a registrar</span><div className="v2-amount-editor"><span className="v2-amount-prefix">$</span><input autoFocus type="number" min="0" step="0.01" value={nuevoImporte} onChange={(e) => setNuevoImporte(e.target.value)} aria-label="Nuevo importe" /></div></label><p className="v2-modal-hint">Podés modificar el importe y guardar el nuevo valor.</p>{errorAccion && <div className="v2-error">{errorAccion}</div>}</ModalV2>}
    {gastoEliminar && <ModalV2 title="¿Eliminar este gasto?" icon="×" tone="danger" onCancel={() => !eliminando && setGastoEliminar(null)} onConfirm={confirmarEliminacion} confirmLabel={eliminando ? 'Eliminando…' : 'Eliminar'}><div className="v2-modal-context"><strong>{nombreServicio(gastoEliminar.servicios?.nombre || gastoEliminar.servicio_nombre, gastoEliminar.servicio_id)}</strong><span>{meses[Number(gastoEliminar.mes)] || ''} {gastoEliminar.año}</span></div><div className="v2-delete-amount">{importe(gastoEliminar.importe)}</div><p className="v2-modal-hint">Esta acción no se puede deshacer.</p>{errorAccion && <div className="v2-error">{errorAccion}</div>}</ModalV2>}
  </section>;
}
