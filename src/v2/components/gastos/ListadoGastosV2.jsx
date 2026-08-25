const meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

function importe(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value) || 0);
}

function nombreServicio(nombre, id) {
  if (!nombre) return `Servicio #${id}`;
  return nombre
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ');
}

export default function ListadoGastosV2({ anio, mes, gastos, loading, error }) {
  return <section className="v2-gastos-panel">
    <div className="v2-section-heading">
      <div><span className="v2-eyebrow">GASTOS REGISTRADOS</span><h2>{meses[Number(mes)] || 'MES'} {anio || ''}</h2></div>
      <span className="v2-count">{gastos.length} registro{gastos.length === 1 ? '' : 's'}</span>
    </div>
    {loading && <div className="v2-state">Cargando gastos…</div>}
    {!loading && error && <div className="v2-state v2-state-error">{error}</div>}
    {!loading && !error && gastos.length === 0 && <div className="v2-empty">No hay gastos registrados para este período.</div>}
    {!loading && !error && gastos.length > 0 && <div className="v2-table-wrap"><table className="v2-table"><thead><tr><th>Servicio</th><th>Importe</th></tr></thead><tbody>{gastos.map((gasto) => <tr key={gasto.id}><td>{nombreServicio(gasto.servicios?.nombre, gasto.servicio_id)}</td><td>{importe(gasto.importe)}</td></tr>)}</tbody></table></div>}
  </section>;
}
