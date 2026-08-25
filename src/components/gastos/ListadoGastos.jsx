import { useState } from 'react';
import Modal from '../common/Modal';
import { formatearNombreServicio, nombreMes, formatearImporte } from '../../utils/formateo';

function nombreServicio(nombre, id) { return nombre ? formatearNombreServicio(nombre) : `Servicio #${id}`; }

export default function ListadoGastos({ anio, mes, gastos, loading, error, onEliminar, onEditar, anual = false, titulo = 'GASTOS REGISTRADOS', total = 0 }) {
  const [gastoEliminar, setGastoEliminar] = useState(null);
  const [gastoEditar, setGastoEditar] = useState(null);
  const [nuevoImporte, setNuevoImporte] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  const abrirEdicion = (gasto) => { setErrorAccion(''); setNuevoImporte(String(gasto.importe ?? '')); setGastoEditar(gasto); };
  const confirmarEdicion = async () => {
    if (!gastoEditar || !onEditar || nuevoImporte === '' || Number(nuevoImporte) < 0) return;
    setEditando(true); setErrorAccion(''); const ok = await onEditar(gastoEditar, nuevoImporte); setEditando(false);
    if (ok) setGastoEditar(null); else setErrorAccion('No se pudo actualizar el importe. Revisá el mensaje de error en el listado.');
  };
  const confirmarEliminacion = async () => {
    if (!gastoEliminar || !onEliminar) return;
    setEliminando(true); setErrorAccion(''); const ok = await onEliminar(gastoEliminar.id); setEliminando(false);
    if (ok) setGastoEliminar(null); else setErrorAccion('No se pudo eliminar el gasto. Revisá el mensaje de error en el listado.');
  };
  const periodoLabel = anual ? `Año ${anio}` : (mes ? `${nombreMes(Number(mes))} ${anio}` : 'MES');

  return <section className="v2-gastos-panel">
    <div className="v2-section-heading">
      <div><span className="v2-eyebrow">{titulo}</span><h2>{periodoLabel}</h2></div>
      <div className="v2-section-total"><span>Total {anual ? 'anual' : 'del mes'}</span><strong>{formatearImporte(total)}</strong></div>
    </div>
    {loading && <div className="v2-state">Cargando gastos…</div>}
    {!loading && error && <div className="v2-state v2-state-error">{error}</div>}
    {!loading && !error && gastos.length === 0 && <div className="v2-empty">No hay gastos registrados para este período.</div>}
    {!loading && !error && gastos.length > 0 && <div className="v2-table-wrap"><table className="v2-table"><thead><tr>{anual && <th>Mes</th>}<th>Servicio</th><th>Importe</th><th className="v2-actions-head">Acciones</th></tr></thead><tbody>{gastos.map((gasto) => <tr key={gasto.id}>{anual && <td>{nombreMes(Number(gasto.mes))}</td>}<td>{nombreServicio(gasto.servicios?.nombre || gasto.servicio_nombre, gasto.servicio_id)}</td><td>{formatearImporte(gasto.importe)}</td><td className="v2-row-actions"><button type="button" onClick={() => abrirEdicion(gasto)} title="Editar importe">✎</button><button type="button" onClick={() => { setErrorAccion(''); setGastoEliminar(gasto); }} title="Eliminar gasto">×</button></td></tr>)}</tbody></table></div>}
    {gastoEditar && <Modal title="Editar importe" icon="✎" tone="edit" onCancel={() => !editando && setGastoEditar(null)} onConfirm={confirmarEdicion} confirmLabel={editando ? 'Guardando…' : 'Guardar cambios'}><div className="v2-modal-context"><strong>{nombreServicio(gastoEditar.servicios?.nombre || gastoEditar.servicio_nombre, gastoEditar.servicio_id)}</strong><span>{nombreMes(Number(gastoEditar.mes))} {gastoEditar.año}</span></div><label className="v2-edit-label"><span>Importe a registrar</span><div className="v2-amount-editor"><span className="v2-amount-prefix">$</span><input autoFocus type="number" min="0" step="0.01" value={nuevoImporte} onChange={(e) => setNuevoImporte(e.target.value)} aria-label="Nuevo importe" /></div></label><p className="v2-modal-hint">Podés modificar el importe y guardar el nuevo valor.</p>{errorAccion && <div className="v2-error">{errorAccion}</div>}</Modal>}
    {gastoEliminar && <Modal title="¿Eliminar este gasto?" icon="×" tone="danger" onCancel={() => !eliminando && setGastoEliminar(null)} onConfirm={confirmarEliminacion} confirmLabel={eliminando ? 'Eliminando…' : 'Eliminar'}><div className="v2-modal-context"><strong>{nombreServicio(gastoEliminar.servicios?.nombre || gastoEliminar.servicio_nombre, gastoEliminar.servicio_id)}</strong><span>{nombreMes(Number(gastoEliminar.mes))} {gastoEliminar.año}</span></div><div className="v2-delete-amount">{formatearImporte(gastoEliminar.importe)}</div><p className="v2-modal-hint">Esta acción no se puede deshacer.</p>{errorAccion && <div className="v2-error">{errorAccion}</div>}</Modal>}
  </section>;
}
