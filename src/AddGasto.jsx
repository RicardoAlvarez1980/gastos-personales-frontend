import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import GraficoGastos from './GraficoGastos';

export default function App() {
  const [gastos, setGastos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({
    servicio_id: '',
    año: new Date().getFullYear(),
    mes: 1,
    importe: ''
  });

  useEffect(() => {
    fetchServicios();
    fetchGastos();
  }, []);

  function fetchServicios() {
    fetch('https://api-gastos-tlyv.onrender.com/servicios')
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(console.error);
  }

  function fetchGastos() {
    fetch('https://api-gastos-tlyv.onrender.com/gastos')
      .then(res => res.json())
      .then(data => setGastos(data))
      .catch(console.error);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNuevoGasto(prev => ({ ...prev, [name]: value }));
  }

  async function addGasto() {
    // Validá que los campos estén completos y correctos antes de enviar
    if (!nuevoGasto.servicio_id || !nuevoGasto.año || !nuevoGasto.mes || !nuevoGasto.importe) {
      alert('Completa todos los campos!');
      return;
    }
    try {
      const res = await fetch('https://api-gastos-tlyv.onrender.com/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicio_id: Number(nuevoGasto.servicio_id),
          año: Number(nuevoGasto.año),
          mes: Number(nuevoGasto.mes),
          importe: Number(nuevoGasto.importe),
        }),
      });
      if (!res.ok) throw new Error('Error al agregar gasto');
      const gastoCreado = await res.json();
      setGastos(prev => [...prev, gastoCreado]);
      alert('Gasto agregado con éxito');
      // Limpiar formulario
      setNuevoGasto({ servicio_id: '', año: new Date().getFullYear(), mes: 1, importe: '' });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <h1>Gastos</h1>
      <div>
        <select name="servicio_id" value={nuevoGasto.servicio_id} onChange={handleInputChange}>
          <option value="">Seleccionar servicio</option>
          {servicios.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        <input
          type="number"
          name="año"
          value={nuevoGasto.año}
          onChange={handleInputChange}
          min="2015"
          max="2035"
          placeholder="Año"
        />
        <input
          type="number"
          name="mes"
          value={nuevoGasto.mes}
          onChange={handleInputChange}
          min="1"
          max="12"
          placeholder="Mes"
        />
        <input
          type="number"
          step="0.01"
          name="importe"
          value={nuevoGasto.importe}
          onChange={handleInputChange}
          placeholder="Importe"
        />
        <button onClick={addGasto}>Agregar Gasto</button>
      </div>

      {/* Aquí tu tabla o tabs con gráficos, etc */}
    </div>
  );
}
