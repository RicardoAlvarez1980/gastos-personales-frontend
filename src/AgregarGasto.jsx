import React, { useState } from 'react';

export default function AgregarGasto({ servicios, addGasto }) {
  // Estado local para los campos del formulario
  const [año, setAño] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(1);
  const [importe, setImporte] = useState('');
  const [servicioId, setServicioId] = useState(servicios.length > 0 ? servicios[0].id : '');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!año || !mes || !importe || !servicioId) {
      alert('Completa todos los campos.');
      return;
    }

    if (mes < 1 || mes > 12) {
      alert('Mes inválido. Debe ser entre 1 y 12.');
      return;
    }

    if (isNaN(parseFloat(importe)) || parseFloat(importe) <= 0) {
      alert('Importe inválido. Debe ser un número positivo.');
      return;
    }

    // Construimos el objeto gasto
    const nuevoGasto = {
      año: Number(año),
      mes: Number(mes),
      importe: parseFloat(importe),
      servicio_id: servicioId,
    };

    // Llamamos a la función pasada por props para agregar el gasto
    addGasto(nuevoGasto);

    // Limpiamos el formulario
    setImporte('');
    setMes(1);
    setAño(new Date().getFullYear());
    setServicioId(servicios.length > 0 ? servicios[0].id : '');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <label>
        Año:
        <input
          type="number"
          value={año}
          onChange={e => setAño(e.target.value)}
          min="2015"
          max={new Date().getFullYear() + 10}
          required
        />
      </label>
      {' '}
      <label>
        Mes:
        <input
          type="number"
          value={mes}
          onChange={e => setMes(e.target.value)}
          min="1"
          max="12"
          required
        />
      </label>
      {' '}
      <label>
        Importe:
        <input
          type="number"
          step="0.01"
          value={importe}
          onChange={e => setImporte(e.target.value)}
          required
        />
      </label>
      {' '}
      <label>
        Servicio:
        <select value={servicioId} onChange={e => setServicioId(e.target.value)} required>
          {servicios.map(serv => (
            <option key={serv.id} value={serv.id}>{serv.nombre}</option>
          ))}
        </select>
      </label>
      {' '}
      <button type="submit">Agregar Gasto</button>
    </form>
  );
}
