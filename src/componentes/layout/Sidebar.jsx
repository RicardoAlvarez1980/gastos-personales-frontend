export default function Sidebar({ setVistaActiva }) {
  return (
    <aside
      style={{
        width: '220px',
        background: '#1e1e1e',
        color: '#fff',
        padding: '1rem'
      }}
    >
      <h3>Gastos</h3>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button onClick={() => setVistaActiva('listado')}>
          📋 Listado
        </button>

        <button onClick={() => setVistaActiva('graficos')}>
          📊 Gráficos
        </button>

        <button onClick={() => setVistaActiva('agregar')}>
          ➕ Agregar gasto
        </button>
      </nav>
    </aside>
  )
}
