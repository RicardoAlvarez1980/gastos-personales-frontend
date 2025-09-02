import React, { useEffect, useState } from 'react';
import GraficoGastos from './GraficoGastos';
import Navbar from './Navbar';
import AgregarGasto from './AgregarGasto';

export default function App() {
  const [gastosCompletos, setGastosCompletos] = useState([]);
  const [porAño, setPorAño] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState('');
  const [cargando, setCargando] = useState(false);
  const [view, setView] = useState('todos'); // 'todos', 'porAño', 'agregar', 'totales'
  const [servicios, setServicios] = useState([]);

  const [totalesAnuales, setTotalesAnuales] = useState({});
  const [totalesGlobales, setTotalesGlobales] = useState([]);
  const [totalesMensuales, setTotalesMensuales] = useState([]);

  const añosDisponibles = [...new Set(gastosCompletos.map(g => g.año))].sort((a, b) => b - a);

  // -------------------------------
  // Helper: Formatear números
  // -------------------------------
  const formatNumber = (num) => {
    return (num || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // -------------------------------
  // Traer todos los gastos completos
  // -------------------------------
  useEffect(() => {
    async function fetchGastosCompletos() {
      setCargando(true);
      try {
        const res = await fetch('https://api-gastos-tlyv.onrender.com/gastos?completo=true');
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        setGastosCompletos(data.gastos || []);
        if (data.gastos && data.gastos.length > 0) {
          const años = [...new Set(data.gastos.map(g => g.año))].sort((a, b) => b - a);
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

  // -------------------------------
  // Traer gastos por año
  // -------------------------------
  useEffect(() => {
    async function fetchGastosPorAño(añoParam) {
      setCargando(true);
      try {
        const res = await fetch(`https://api-gastos-tlyv.onrender.com/gastos?año=${encodeURIComponent(añoParam)}?completo=true`);
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        setPorAño(data.gastos || []);
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

  // -------------------------------
  // Traer servicios
  // -------------------------------
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

  // -------------------------------
  // Traer totales anuales por servicio
  // -------------------------------
  useEffect(() => {
    async function fetchTotalesAnuales() {
      try {
        const res = await fetch('https://api-gastos-tlyv.onrender.com/totales/anuales');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTotalesAnuales(data);
      } catch (e) {
        console.error('Error fetching totales anuales:', e);
      }
    }
    fetchTotalesAnuales();
  }, []);

  // -------------------------------
  // Traer totales globales anuales
  // -------------------------------
  useEffect(() => {
    async function fetchTotalesGlobales() {
      try {
        const res = await fetch('https://api-gastos-tlyv.onrender.com/totales/globales-anuales');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTotalesGlobales(data);
      } catch (e) {
        console.error('Error fetching totales globales:', e);
      }
    }
    fetchTotalesGlobales();
  }, []);

  // -------------------------------
  // Traer totales mensuales de todos los años
  // -------------------------------
  useEffect(() => {
    async function fetchTotalesMensuales() {
      try {
        const res = await fetch('https://api-gastos-tlyv.onrender.com/totales/mensuales-todos');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTotalesMensuales(data);
      } catch (e) {
        console.error('Error fetching totales mensuales:', e);
      }
    }
    fetchTotalesMensuales();
  }, []);

  // -------------------------------
  // Agregar gasto desde el formulario
  // -------------------------------
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

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="app-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <Navbar view={view} setView={setView} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setView('todos')} aria-pressed={view === 'todos'}>Todos</button>
          <button onClick={() => setView('porAño')} aria-pressed={view === 'porAño'}>Por Año</button>
          <button onClick={() => setView('agregar')} aria-pressed={view === 'agregar'}>Agregar Gasto</button>
          <button onClick={() => setView('totales')} aria-pressed={view === 'totales'}>Totales</button>
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
                      <td>${formatNumber(parseFloat(g.importe))}</td>
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
            <GraficoGastos
              porAño={porAño}
              añoSeleccionado={añoSeleccionado}
              añosDisponibles={añosDisponibles}
              onCambiarAño={setAñoSeleccionado}
            />
          )
        )}

        {/* Vista: Agregar Gasto */}
        {view === 'agregar' && (
          <AgregarGasto servicios={servicios} addGasto={handleAddGasto} />
        )}

        {/* Vista: Totales */}
        {view === 'totales' && (
          cargando ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="totales-wrapper">
              <h3>Totales Anuales por Servicio</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Año</th>
                    {servicios.map(s => (
                      <th key={s.id}>{s.nombre}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(totalesAnuales).sort((a, b) => a - b).map(año => (
                    <tr key={año}>
                      <td>{año}</td>
                      {servicios.map(s => (
                        <td key={s.id}>${formatNumber(totalesAnuales[año][s.nombre])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Totales Globales Anuales</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {totalesGlobales.map((t, i) => (
                    <tr key={i}>
                      <td>{t.año}</td>
                      <td>${formatNumber(t.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Totales Mensuales</h3>
              {totalesMensuales.map(({ año, meses }) => (
                <div key={año} style={{ marginBottom: '2rem' }}>
                  <h4>Año {año}</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Mes</th>
                        {servicios.map(s => <th key={s.id}>{s.nombre}</th>)}
                        <th>Total Mensual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meses.map(({ mes, totalPorServicio, totalMensual }) => (
                        <tr key={mes}>
                          <td>{mes.toString().padStart(2, '0')}</td>
                          {servicios.map(s => (
                            <td key={s.id}>${formatNumber(totalPorServicio[s.nombre])}</td>
                          ))}
                          <td>${formatNumber(totalMensual)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
