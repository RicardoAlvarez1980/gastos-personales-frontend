import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function GraficoGastos({ porAño, añoSeleccionado, añosDisponibles = [], onCambiarAño }) {
  if (!Array.isArray(porAño) || porAño.length === 0) return <div>No hay datos para mostrar.</div>;
  if (!Array.isArray(añosDisponibles) || añosDisponibles.length === 0) return <div>No hay años disponibles.</div>;

  const servicios = [...new Set(porAño.map(g => g.servicio))];

  const mesesData = {};
  for (let m = 1; m <= 12; m++) {
    mesesData[m] = { mes: nombresMeses[m - 1] };
    servicios.forEach(s => mesesData[m][s] = 0);
  }

  porAño.forEach(g => {
    const mesNum = Number(g.mes);
    if (mesNum >= 1 && mesNum <= 12 && g.servicio) {
      mesesData[mesNum][g.servicio] += parseFloat(g.importe) || 0;
    }
  });

  const datosGrafico = Object.values(mesesData);

  function getColor(idx) {
    const colores = [
      "#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c",
      "#8dd1e1", "#83a6ed", "#8aabb0", "#c8c8c8", "#b0a990"
    ];
    return colores[idx % colores.length];
  }

  // -------------------------------
  // Helper: Formatear números AR
  // -------------------------------
  const formatNumber = (num) => {
    return (num || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div>
      <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        AÑO
        <select
          value={añoSeleccionado}
          onChange={(e) => onCambiarAño(e.target.value)}
          style={{
            backgroundColor: '#292929',
            color: '#ddd',
            border: '1px solid #61dafb',
            borderRadius: '6px',
            padding: '0.2rem 0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {añosDisponibles.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={datosGrafico} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis tickFormatter={valor => `$${formatNumber(valor)}`} />
          <Tooltip formatter={valor => `$${formatNumber(valor)}`} />
          <Legend />
          {servicios.map((servicio, idx) => (
            <Bar key={servicio} dataKey={servicio} stackId="a" fill={getColor(idx)} name={servicio} />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <table className="table table-bordered mt-4">
        <thead className="table-dark text-center">
          <tr>
            <th>Servicio / Mes</th>
            {nombresMeses.map(mes => (
              <th key={mes}>{mes}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {servicios.map(servicio => (
            <tr key={servicio}>
              <td><b>{servicio}</b></td>
              {datosGrafico.map(dato => (
                <td key={dato.mes} className="text-end">${formatNumber(dato[servicio])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
