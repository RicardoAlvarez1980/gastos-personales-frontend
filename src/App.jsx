import React, { useEffect, useState } from 'react';
import GraficoGastos from './GraficoGastos';
import Navbar from './Navbar';

export default function App() {
  const [gastosCompletos, setGastosCompletos] = useState([]);
  const [porAño, setPorAño] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState('');
  const [cargando, setCargando] = useState(false);
  const [view, setView] = useState('todos'); // 'todos' o 'porAño'

  const añosDisponibles = [...new Set(gastosCompletos.map(g => g.año))].sort((a, b) => b - a);

  useEffect(() => {
    async function fetchGastosCompletos() {
      setCargando(true);
      try {
        const res = await fetch('https://api-gastos-tlyv.onrender.com/gastos/completos');
        const data = await res.json();
        setGastosCompletos(data);
        if (data.length > 0) {
          const años = [...new Set(data.map(g => g.año))].sort((a, b) => b - a);
          setAñoSeleccionado(años[0]);
        }
      } catch (e) {
        console.error('Error fetching gastos completos:', e);
      }
      setCargando(false);
    }
    fetchGastosCompletos();
  }, []);

  useEffect(() => {
    async function fetchGastosPorAño(añoParam) {
      setCargando(true);
      try {
        const res = await fetch(`https://api-gastos-tlyv.onrender.com/gastos/${añoParam}`);
        const data = await res.json();
        if (Array.isArray(data.gastos)) {
          setPorAño(data.gastos);
        } else {
          setPorAño([]);
        }
      } catch (e) {
        console.error(`Error fetching gastos por año ${añoParam}:`, e);
        setPorAño([]);
      }
      setCargando(false);
    }
    if (añoSeleccionado && view === 'porAño') {
      fetchGastosPorAño(añoSeleccionado);
    }
  }, [añoSeleccionado, view]);

  return (
    <div className="app-container">
      <Navbar view={view} setView={setView} />

      <main className="app-content" role="tabpanel">
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
      </main>
    </div>
  );
}
