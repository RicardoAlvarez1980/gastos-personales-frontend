import React, { useState, useEffect } from 'react'
import { formatearNombreServicio, nombreMes } from '../utils/formateo.js'

export default function FormularioAgregarGasto({
  gastos,
  servicios,
  aniosDisponibles,
  mesesPorAnio,
  onAgregar,
  colores,
  resetFlag,
  onResetHandled,
}) {
  const [nuevoGasto, setNuevoGasto] = useState({
    año: '',
    mes: '',
    servicio_id: '',
    importe: '',
  })

  useEffect(() => {
    if (resetFlag) {
      setNuevoGasto({ año: '', mes: '', servicio_id: '', importe: '' })
      if (onResetHandled) onResetHandled()
    }
  }, [resetFlag, onResetHandled])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevoGasto(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!nuevoGasto.año || !nuevoGasto.mes || !nuevoGasto.servicio_id || !nuevoGasto.importe) {
      alert('Por favor completá todos los campos.')
      return
    }

    const gastoParaEnviar = {
      año: Number(nuevoGasto.año),
      mes: Number(nuevoGasto.mes),
      servicio_id: Number(nuevoGasto.servicio_id),
      importe: Number(nuevoGasto.importe),
    }

    onAgregar(gastoParaEnviar)
  }

  const meses = nuevoGasto.año ? mesesPorAnio[nuevoGasto.año] || [] : []

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: colores.fondoForm, padding: 20, borderRadius: 8 }}>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="año">Año:</label><br />
        <select
          id="año"
          name="año"
          value={nuevoGasto.año}
          onChange={handleChange}
          style={{ width: '100%', padding: 6 }}
        >
          <option value="">Seleccioná un año</option>
          {aniosDisponibles.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="mes">Mes:</label><br />
        <select
          id="mes"
          name="mes"
          value={nuevoGasto.mes}
          onChange={handleChange}
          disabled={!nuevoGasto.año}
          style={{ width: '100%', padding: 6 }}
        >
          <option value="">Seleccioná un mes</option>
          {meses.map(m => (
            <option key={m} value={m}>{nombreMes(m)}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="servicio_id">Servicio:</label><br />
        <select
          id="servicio_id"
          name="servicio_id"
          value={nuevoGasto.servicio_id}
          onChange={handleChange}
          style={{ width: '100%', padding: 6 }}
        >
          <option value="">Seleccioná un servicio</option>
          {servicios.map(s => (
            <option key={s.id} value={s.id}>{formatearNombreServicio(s.nombre)}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="importe">Importe:</label><br />
        <input
          id="importe"
          name="importe"
          type="number"
          step="0.01"
          min="0"
          value={nuevoGasto.importe}
          onChange={handleChange}
          style={{ width: '100%', padding: 6 }}
        />
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: colores.botonFondo,
          color: colores.botonTexto,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Agregar Gasto
      </button>
    </form>
  )
}
