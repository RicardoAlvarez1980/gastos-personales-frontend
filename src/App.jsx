import React, { useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export default function App() {
  const [gastosCompletos, setGastosCompletos] = useState([]);
  const [porAño, setPorAño] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchGastosCompletos();
  }, []);

  useEffect(() => {
    if (añoSeleccionado) fetchGastosPorAño(añoSeleccionado);
  }, [añoSeleccionado]);

  async function fetchGastosCompletos() {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3000/gastos/completos');
      const data = await res.json();
      setGastosCompletos(data);
      if (data.length > 0 && !añoSeleccionado) setAñoSeleccionado(data[0].año);
    } catch (e) {
      console.error('Error fetching gastos completos:', e);
    }
    setCargando(false);
  }

  async function fetchGastosPorAño(año) {
    try {
      const res = await fetch(`http://localhost:3000/gastos/${año}`);
      const data = await res.json();
      setPorAño(data.gastos || []);
    } catch (e) {
      console.error('Error fetching gastos por año:', e);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard Gastos</h1>
      <Tabs.Root defaultValue="completos">
        <Tabs.List style={{ display: 'flex', marginBottom: 12 }}>
          <Tabs.Trigger value="completos" style={{ marginRight: 12, cursor: 'pointer' }}>Todos</Tabs.Trigger>
          <Tabs.Trigger value="porAño" style={{ cursor: 'pointer' }}>Por Año</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="completos">
          {cargando ? <p>Cargando...</p> : (
            gastosCompletos.length === 0 ? <p>No hay datos.</p> : (
              <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                      <td>{g.mes.toString().padStart(2,'0')}</td>
                      <td>${(parseFloat(g.importe) || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Tabs.Content>

        <Tabs.Content value="porAño">
          <label>
            Seleccioná año:
            <select
              value={añoSeleccionado}
              onChange={e => setAñoSeleccionado(e.target.value)}
              style={{ marginLeft: 8, padding: 4 }}
            >
              {[...new Set(gastosCompletos.map(g => g.año))].map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </label>

          {cargando ? <p>Cargando...</p> : (
            porAño.length === 0 ? <p>No hay datos para este año.</p> : (
              <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Mes</th>
                    <th>Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {porAño.map((g, i) => (
                    <tr key={i}>
                      <td>{g.servicio}</td>
                      <td>{g.mes.toString().padStart(2,'0')}</td>
                      <td>${(parseFloat(g.importe) || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
