import { useState } from 'react';
import ModalV2 from '../common/ModalV2';

const meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
function importe(value) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value) || 0); }
function nombreServicio(nombre, id) { if (!nombre) return `Servicio #${id}`; return nombre.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' '); }

export default function ListadoGastosV2({ anio, mes, gastos, loading, error, onEliminar, onEditar }) {
  const [gastoEliminar, setGastoEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');
  const confirmarEliminacion = async () => {
    if (!gastoEliminar || !onEliminar) return;
    setEliminando(true); setErrorEliminar('');
    const ok = await onEliminar(gastoEliminar.id);
    setEliminando(false);
    if (ok) setGastoEliminar(null);
    else setErrorEliminar('No se pudo eliminar el gasto. Revisá el mensaje de error en el listado.');
  };
  return <section className="v2-gastos-panel">
    <div className="v2-section-heading"><div><span className="v2-eyebrow">GASTOS REGISTRADOS</span><h2>{meses[Number(mes)] || 'MES'} {anio || ''}</h2></div><span className="v2-count">{gastos.length} registro{gastos.length === 1 ? '' : 's'}</span></div>
    {loading && <div className="v2-state">Cargando gastos…</div>}
    {!loading && error && <div className="v2-state v2-state-error">{error}</div>}
    {!loading && !error && gastos.length === 0 && <div className="v2-empty">No hay gastos registrados para este período.</div>}
    {!loading && !error && gastos.length > 0 && <div className="v2-table-wrap"><table className="v2-table"><thead><tr><th>Servicio</th><th>Importe</th><th className="v2-actions-head">Acciones</th></tr></thead><tbody>{gastos.map((gasto) => <tr key={gasto.id}><td>{nombreServicio(gasto.servicios?.nombre || gasto.servicio_nombre, gasto.servicio_id)}</td><td>{importe(gasto.importe)}</td><td className="v2-row-actions"><button type="button" onClick={() => onEditar?.(gasto)} title="Editar importe">✎</button><button type="button" onClick={() => { setErrorEliminar(''); setGastoEliminar(gasto); }} title="Eliminar gasto">×</button></td></tr>)}</tbody></table></div>}
    {gastoEliminar && <ModalV2 title="¿Eliminar este gasto?" onCancel={() => !eliminando && setGastoEliminar(null)} onConfirm={confirmarEliminacion} confirmLabel={eliminando ? 'Eliminando…' : 'Eliminar'}><p><strong>{nombreServicio(gastoEliminar.servicios?.nombre || gastoEliminar.servicio_nombre, gastoEliminar.servicio_id)}</strong> · {meses[Number(gastoEliminar.mes)] || ''} {gastoEliminar.año}</p><p>Importe: <strong>{importe(gastoEliminar.importe)}</strong></p><p>Esta acción no se puede deshacer.</p>{errorEliminar && <div className="v2-error">{errorEliminar}</div>}</ModalV2>}
  </section>;
}
