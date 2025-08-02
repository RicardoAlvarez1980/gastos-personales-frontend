import React, { useEffect, useState } from 'react';
import GraficoGastos from './GraficoGastos';
import Navbar from './Navbar';
import AgregarGasto from './AgregarGasto';

export default function App() {
  const [gastosCompletos, setGastosCompletos] = useState([]);
  const [porAño, setPorAño] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState('');
  const [cargando, setCargando] = useState(false);
  const [view, setView] = useState('todos'); // 'todos', 'porAño', 'agregar'
  const [servicios, setServicios] = useState([]);

  const añosDisponibles = [...new Set(gastosCompletos.map(g => g.año))].sort((a, b) => b - a);

  // Traer todos los gastos completos
  useEffect(() => {
    async function fetchGastosCompletos() {
      setCargando(true);
      try {
        const res = await fetch('https://api-gastos-tlyv.onrender.com/gastos/');
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        setGastosCompletos(data);
        if (data.length > 0) {
          const años = [...new Set(data.map(g => g.año))].sort((a, b) => b - a);
          setAñoSeleccionado(años[0]);
        }
      } catch (e) {
        console.error('Error fetching gastos completos:', e);
      } finally {
        setCargando(false);
      }
    }
    fetchGastosCompletos();
  }, []);

  // Traer gastos por año cuando cambia el año seleccionado o la vista
  useEffect(() => {
    async function fetchGastosPorAño(añoParam) {
      setCargando(true);
      try {
        const res = await fetch(`https://api-gastos-tlyv.onrender.com/gastos/${encodeURIComponent(añoParam)}`);
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        if (Array.isArray(data.gastos)) {
          setPorAño(data.gastos);
        } else {
          setPorAño([]);
        }
      } catch (e) {
        console.error(`Error fetching gastos por año ${añoParam}:`, e);
        setPorAño([]);
      } finally {
        setCargando(false);
      }
    }
    if (añoSeleccionado && view === 'porAño') {
      fetchGastosPorAño(añoSeleccionado);
    }
  }, [añoSeleccionado, view]);

  // Traer servicios para el formulario
  useEffect(() => {
    async function fetchServicios() {
      try {
        const res = await fetch('https://api-gastos-tlyv.onrender.com/servicios');
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        setServicios(data);
      } catch (e) {
        console.error('Error fetching servicios:', e);
      }
    }
    fetchServicios();
  }, []);

  // Función para agregar gasto desde el formulario
  const handleAddGasto = async (nuevoGasto) => {
    try {
      setCargando(true);
      const res = await fetch('https://api-gastos-tlyv.onrender.com/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoGasto),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        alert('Error al agregar gasto: ' + (errBody.error || res.statusText));
        return;
      }
      const gastoCreado = await res.json();
      console.log('Gasto creado recibido del backend:', gastoCreado);

      // Mapear servicio_id a nombre de servicio
      const servicioNombre = servicios.find(s => s.id === gastoCreado.servicio_id)?.nombre || 'Desconocido';
      const gastoConNombre = { ...gastoCreado, servicio: servicioNombre };

      setGastosCompletos(prev => [...prev, gastoConNombre]);
      setView('todos');
    } catch (e) {
      alert('Error en la comunicación con el servidor.');
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="app-container">
      {/* Barra de navegación / selección de vista */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <Navbar view={view === 'agregar' ? view : view} setView={setView} />
        {/* Si usás Navbar personalizado que ya tiene botones, podés mover "Agregar Gasto" allí */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setView('todos')} aria-pressed={view === 'todos'}>
            Todos
          </button>
          <button onClick={() => setView('porAño')} aria-pressed={view === 'porAño'}>
            Por Año
          </button>
          <button onClick={() => setView('agregar')} aria-pressed={view === 'agregar'}>
            Agregar Gasto
          </button>
        </div>
      </div>

      <main className="app-content" role="tabpanel">
        {/* Vista: Todos */}
        {view === 'todos' && (
          cargando && gastosCompletos.length === 0 ? (
            <div className="loading">Cargando...</div>
          ) : gastosCompletos.length === 0 ? (
            <div className="alert">No hay datos.</div>
          ) : (
            <div className="table-wrapper">
              <table className="table" aria-label="Tabla de todos los gastos">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Año</th>
                    <th>Mes</th>
                    <th>Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosCompletos.map((g, i) => (
                    <tr key={i}>
                      <td>{g.servicio}</td>
                      <td>{g.año}</td>
                      <td>{g.mes.toString().padStart(2, '0')}</td>
                      <td>${(parseFloat(g.importe) || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Vista: Por Año */}
        {view === 'porAño' && (
          cargando ? (
            <div className="loading">Cargando...</div>
          ) : porAño.length === 0 ? (
            <div className="alert">No hay datos para este año.</div>
          ) : (
            <div className="grafico-wrapper">
              <GraficoGastos
                porAño={porAño}
                añoSeleccionado={añoSeleccionado}
                añosDisponibles={añosDisponibles}
                onCambiarAño={setAñoSeleccionado}
              />
            </div>
          )
        )}

        {/* Vista: Agregar Gasto */}
        {view === 'agregar' && (
          <div className="agregar-gasto-wrapper">
            <AgregarGasto servicios={servicios} addGasto={handleAddGasto} />
          </div>
        )}
      </main>
    </div>
  );
}
