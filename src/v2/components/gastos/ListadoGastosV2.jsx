const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function importe(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value) || 0);
}

export default function ListadoGastosV2({ anio, mes, gastos, loading, error }) {
  return (
    <section className="v2-gastos-panel">
      <div className="v2-section-heading">
        <div>
          <span className="v2-eyebrow">GASTOS REGISTRADOS</span>
          <h2>{meses[Number(mes)] || 'Mes'} {anio || ''}</h2>
        </div>
        <span className="v2-count">{gastos.length} registro{gastos.length === 1 ? '' : 's'}</span>
      </div>

      {loading && <div className="v2-state">Cargando gastos…</div>}
      {!loading && error && <div className="v2-state v2-state-error">{error}</div>}
      {!loading && !error && gastos.length === 0 && (
        <div className="v2-empty">No hay gastos registrados para este período.</div>
      )}
      {!loading && !error && gastos.length > 0 && (
        <div className="v2-table-wrap">
          <table className="v2-table">
            <thead><tr><th>Servicio</th><th>Importe</th></tr></thead>
            <tbody>
              {gastos.map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.servicios?.nombre || `Servicio #${gasto.servicio_id}`}</td>
                  <td>{importe(gasto.importe)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
