import React from 'react';

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function SelectorAniosMeses({
  anios,
  meses,
  anioSeleccionado,
  mesSeleccionado,
  setAnioSeleccionado,
  setMesSeleccionado
}) {
  return (
    <div style={{ marginBottom: 20, display: 'flex', gap: 15, alignItems: 'center' }}>
      <label>
        Año:{' '}
        <select
          value={anioSeleccionado || ''}
          onChange={e => setAnioSeleccionado(Number(e.target.value))}
        >
          {anios.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>

      <label>
        Mes:{' '}
        <select
          value={mesSeleccionado || ''}
          onChange={e => setMesSeleccionado(Number(e.target.value))}
          disabled={!meses.length}
        >
          {meses.map(m => (
            <option key={m} value={m}>{NOMBRES_MESES[m - 1]}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
