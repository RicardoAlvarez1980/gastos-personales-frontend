import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const COLORES = [
  '#8884d8', '#82ca9d', '#ffc658', '#d0ed57',
  '#a4de6c', '#8dd1e1', '#83a6ed', '#8aabb0'
];

export default function GraficoGastos({
  porAño,
  gastosReales,     // 🔑 vienen directo de App.jsx
  servicios,        // 🔑 tabla servicios
  añoSeleccionado,
  añosDisponibles,
  onCambiarAño,
  onDeleteGasto,
  onEditGasto,
  cargando
}) {
  const [editandoGasto, setEditandoGasto] = useState(null);

  /* -------------------- UTILIDADES -------------------- */

  const format = n =>
    Number(n || 0).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const nombreServicio = id =>
    servicios.find(s => s.id === id)?.nombre || 'Desconocido';

  /* -------------------- DATOS GRAFICO -------------------- */

  const { serviciosUnicos, dataGrafico } = useMemo(() => {
    const nombres = [...new Set(porAño.map(g => g.servicio))];

    const base = {};
    for (let i = 1; i <= 12; i++) {
      base[i] = { mes: MESES[i - 1] };
      nombres.forEach(n => base[i][n] = 0);
    }

    porAño.forEach(g => {
      base[g.mes][g.servicio] += Number(g.importe) || 0;
    });

    return {
      serviciosUnicos: nombres,
      dataGrafico: Object.values(base)
    };
  }, [porAño]);

  /* -------------------- EDITAR -------------------- */

const clickEditar = (gastoUI) => {
  const gastoReal = gastosReales.find(gr => gr.id === gastoUI.id);

  console.log('EDITANDO GASTO REAL:', gastoReal);

  setEditandoGasto({
    id: gastoReal.id,
    servicio_id: gastoReal.servicio_id, // 🔒 ESTE ERA EL FALTANTE
    año: gastoReal.año,
    mes: gastoReal.mes,
    importe: gastoReal.importe
  });
};


  const guardar = () => {
    onEditGasto(editandoGasto);
    setEditandoGasto(null);
  };

  /* -------------------- RENDER -------------------- */

  if (!porAño?.length) {
    return <p style={{ textAlign: 'center' }}>No hay datos</p>;
  }

  return (
    <div>

      <h3 style={{ textAlign: 'center' }}>
        Gastos {añoSeleccionado}
        <select
          value={añoSeleccionado}
          onChange={e => onCambiarAño(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {añosDisponibles.map(a =>
            <option key={a} value={a}>{a}</option>
          )}
        </select>
      </h3>

      {/* ----------- GRAFICO ----------- */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dataGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          {serviciosUnicos.map((s, i) => (
            <Bar
              key={s}
              dataKey={s}
              stackId="a"
              fill={COLORES[i % COLORES.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* ----------- TABLA ----------- */}
      <h3 style={{ marginTop: 32 }}>Detalle</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Mes</th>
            <th>Importe</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {porAño.map(g =>
            editandoGasto?.id === g.id ? (
              <tr key={g.id}>
                <td>{g.servicio}</td>
                <td>{MESES[g.mes - 1]}</td>
                <td>
                  <input
                    type="number"
                    value={editandoGasto.importe}
                    onChange={e =>
                      setEditandoGasto({
                        ...editandoGasto,
                        importe: e.target.value
                      })
                    }
                  />
                </td>
                <td>
                  <button onClick={guardar} disabled={cargando}>✅</button>
                  <button onClick={() => setEditandoGasto(null)}>❌</button>
                </td>
              </tr>
            ) : (
              <tr key={g.id}>
                <td>{g.servicio}</td>
                <td>{MESES[g.mes - 1]}</td>
                <td>${format(g.importe)}</td>
                <td>
                  <button onClick={() => clickEditar(g)}>✏️</button>
                  <button
                    onClick={() => onDeleteGasto(g.id)}
                    disabled={cargando}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

    </div>
  );
}
