import { formatearNombreServicio, nombreMes } from '../../utils/formateo'

const PAGE_SIZE = 10

export default function VistaListado({
  gastos,
  anios,
  anioSeleccionado,
  setAnioSeleccionado,
  mesSeleccionado,
  setMesSeleccionado,
  page,
  setPage,
  loading,
  onEliminar,
}) {
  const mostrarPaginado = anioSeleccionado === 'ALL' || mesSeleccionado === 'ALL'

  return (
    <div>
      <h2>Listado de gastos</h2>

      {/* ===========================
          SELECTORES
      =========================== */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select
          value={anioSeleccionado}
          onChange={e => {
            setAnioSeleccionado(e.target.value)
            setPage(0)
          }}
        >
          <option value="">Seleccionar año</option>
          <option value="ALL">Todos</option>
          {anios.map(anio => (
            <option key={anio} value={anio}>
              {anio}
            </option>
          ))}
        </select>

        <select
          value={mesSeleccionado}
          onChange={e => {
            setMesSeleccionado(e.target.value)
            setPage(0)
          }}
          disabled={!anioSeleccionado}
        >
          <option value="">Seleccionar mes</option>
          <option value="ALL">Todos</option>

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(mes => (
            <option key={mes} value={mes}>
              {nombreMes(mes)}
            </option>
          ))}
        </select>
      </div>

      {/* ===========================
          TABLA
      =========================== */}
      {loading && <p>Cargando...</p>}

      {!loading && gastos.length > 0 && (
        <>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Año</th>
                <th>Mes</th>
                <th>Servicio</th>
                <th>Importe</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map(g => (
                <tr key={g.id}>
                  <td>{g.año}</td><td>{nombreMes(g.mes)}</td><td>{formatearNombreServicio(g.servicio_nombre)}</td><td>{Number(g.importe).toLocaleString('es-AR', {style: 'currency', currency: 'ARS'})}</td><td><button onClick={() => onEliminar(g.id)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ===========================
              PAGINADO
          =========================== */}
          {mostrarPaginado && (
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => setPage(p => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                ← Anterior
              </button>

              <span style={{ margin: '0 1rem' }}>Página {page + 1}</span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={gastos.length < PAGE_SIZE}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {!loading && anioSeleccionado && gastos.length === 0 && (
        <p>No hay gastos para ese criterio.</p>
      )}
    </div>
  )
}
