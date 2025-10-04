import React, { useState, useEffect } from 'react';

export default function AgregarGasto({ servicios, addGasto }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [año, setAño] = useState(currentYear);
  const [mes, setMes] = useState(currentMonth);
  const [importe, setImporte] = useState('');
  const [servicioId, setServicioId] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Sincronizar servicioId cuando cambien los servicios
  useEffect(() => {
    if (servicios.length > 0 && !servicioId) {
      setServicioId(servicios[0].id);
    }
  }, [servicios, servicioId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!año || !mes || !importe || !servicioId) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const mesNum = Number(mes);
    if (mesNum < 1 || mesNum > 12) {
      alert('El mes debe estar entre 1 y 12.');
      return;
    }

    const importeNum = parseFloat(importe);
    if (isNaN(importeNum) || importeNum <= 0) {
      alert('El importe debe ser un número positivo.');
      return;
    }

    const añoNum = Number(año);
    if (añoNum < 2000 || añoNum > currentYear + 10) {
      alert(`El año debe estar entre 2000 y ${currentYear + 10}.`);
      return;
    }

    // Construir objeto gasto
    const nuevoGasto = {
      año: añoNum,
      mes: mesNum,
      importe: importeNum,
      servicio_id: Number(servicioId),
    };

    setEnviando(true);
    try {
      await addGasto(nuevoGasto);
      
      // Limpiar formulario después del éxito
      setImporte('');
      setMes(currentMonth);
      setAño(currentYear);
      if (servicios.length > 0) {
        setServicioId(servicios[0].id);
      }
    } catch (error) {
      console.error('Error al agregar gasto:', error);
    } finally {
      setEnviando(false);
    }
  };

  if (servicios.length === 0) {
    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '4px'
      }}>
        Cargando servicios...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      maxWidth: '500px',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>
        Agregar Nuevo Gasto
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="servicio" style={{ fontWeight: '600' }}>
          Servicio:
        </label>
        <select 
          id="servicio"
          value={servicioId} 
          onChange={e => setServicioId(e.target.value)} 
          required
          disabled={enviando}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        >
          {servicios.map(serv => (
            <option key={serv.id} value={serv.id}>
              {serv.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="año" style={{ fontWeight: '600' }}>
            Año:
          </label>
          <input
            id="año"
            type="number"
            value={año}
            onChange={e => setAño(e.target.value)}
            min="2000"
            max={currentYear + 10}
            required
            disabled={enviando}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="mes" style={{ fontWeight: '600' }}>
            Mes:
          </label>
          <input
            id="mes"
            type="number"
            value={mes}
            onChange={e => setMes(e.target.value)}
            min="1"
            max="12"
            required
            disabled={enviando}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="importe" style={{ fontWeight: '600' }}>
          Importe ($):
        </label>
        <input
          id="importe"
          type="number"
          step="0.01"
          value={importe}
          onChange={e => setImporte(e.target.value)}
          placeholder="Ej: 1500.50"
          required
          disabled={enviando}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
      </div>

      <button 
        type="submit"
        disabled={enviando}
        style={{
          padding: '0.75rem',
          backgroundColor: enviando ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: enviando ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={e => !enviando && (e.target.style.backgroundColor = '#218838')}
        onMouseOut={e => !enviando && (e.target.style.backgroundColor = '#28a745')}
      >
        {enviando ? 'Agregando...' : 'Agregar Gasto'}
      </button>
    </form>
  );
}