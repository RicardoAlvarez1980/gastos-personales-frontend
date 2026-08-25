import React, { useState, useEffect, useRef } from 'react'
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
  const [nuevoGasto, setNuevoGasto] = useState({ año: '', mes: '', servicio_id: '', importe: '' })
  const [serviciosAbierto, setServiciosAbierto] = useState(false)
  const serviciosRef = useRef(null)

  useEffect(() => {
    if (resetFlag) {
      setNuevoGasto({ año: '', mes: '', servicio_id: '', importe: '' })
      setServiciosAbierto(false)
      if (onResetHandled) onResetHandled()
    }
  }, [resetFlag, onResetHandled])

  useEffect(() => {
    const cerrarAlHacerClickAfuera = (e) => {
      if (serviciosRef.current && !serviciosRef.current.contains(e.target)) setServiciosAbierto(false)
    }
    document.addEventListener('mousedown', cerrarAlHacerClickAfuera)
    return () => document.removeEventListener('mousedown', cerrarAlHacerClickAfuera)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNuevoGasto(prev => ({ ...prev, [name]: value }))
  }

  const seleccionarServicio = (id) => {
    setNuevoGasto(prev => ({ ...prev, servicio_id: String(id) }))
    setServiciosAbierto(false)
  }

  const servicioSeleccionado = servicios.find(s => String(s.id) === String(nuevoGasto.servicio_id))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nuevoGasto.año || !nuevoGasto.mes || !nuevoGasto.servicio_id || !nuevoGasto.importe) {
      alert('Por favor completá todos los campos.')
      return
    }
    onAgregar({
      año: Number(nuevoGasto.año),
      mes: Number(nuevoGasto.mes),
      servicio_id: Number(nuevoGasto.servicio_id),
      importe: Number(nuevoGasto.importe),
    })
  }

  const meses = [1,2,3,4,5,6,7,8,9,10,11,12]
  const estiloSelect = {
    width: '100%', height: 40, padding: '0 12px', border: '1px solid #cbd5e1',
    borderRadius: 7, backgroundColor: '#fff', color: '#222', fontSize: 14,
    boxSizing: 'border-box', outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: colores.fondoForm, padding: 20, borderRadius: 8 }}>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="año">Año:</label><br />
        <select id="año" name="año" value={nuevoGasto.año} onChange={handleChange} style={estiloSelect}>
          <option value="">Seleccioná un año</option>
          {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="mes">Mes:</label><br />
        <select id="mes" name="mes" value={nuevoGasto.mes} onChange={handleChange} disabled={!nuevoGasto.año} style={{ ...estiloSelect, opacity: !nuevoGasto.año ? 0.65 : 1 }}>
          <option value="">Seleccioná un mes</option>
          {meses.map(m => <option key={m} value={m}>{nombreMes(m)}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="servicio_id">Servicio:</label><br />
        <div ref={serviciosRef} style={{ position: 'relative' }}>
          <button type="button" onClick={() => setServiciosAbierto(prev => !prev)} aria-haspopup="listbox" aria-expanded={serviciosAbierto}
            style={{ ...estiloSelect, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              {servicioSeleccionado && <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: servicioSeleccionado.color || '#999', display: 'inline-block', flexShrink: 0 }} />}
              <span style={{ color: servicioSeleccionado ? '#222' : '#64748b' }}>
                {servicioSeleccionado ? formatearNombreServicio(servicioSeleccionado.nombre) : 'Seleccioná un servicio'}
              </span>
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>▼</span>
          </button>
          {serviciosAbierto && (
            <div role="listbox" style={{ position: 'absolute', zIndex: 1000, top: 'calc(100% + 4px)', left: 0, right: 0, maxHeight: 240, overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: 7, boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)', padding: 4 }}>
              <button type="button" onClick={() => seleccionarServicio('')} style={{ width: '100%', border: 'none', background: !nuevoGasto.servicio_id ? '#f1f5f9' : 'transparent', borderRadius: 5, padding: '9px 10px', textAlign: 'left', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>Seleccioná un servicio</button>
              {servicios.map(s => {
                const seleccionado = String(s.id) === String(nuevoGasto.servicio_id)
                return (
                  <button key={s.id} type="button" role="option" aria-selected={seleccionado} onClick={() => seleccionarServicio(s.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, border: 'none', background: seleccionado ? '#f1f5f9' : 'transparent', borderRadius: 5, padding: '9px 10px', textAlign: 'left', color: '#222', cursor: 'pointer', fontSize: 14 }}>
                    <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: s.color || '#999', display: 'inline-block', flexShrink: 0 }} />
                    <span>{formatearNombreServicio(s.nombre)}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="importe">Importe:</label><br />
        <input id="importe" name="importe" type="number" step="0.01" min="0" value={nuevoGasto.importe} onChange={handleChange} style={estiloSelect} />
      </div>
      <button type="submit" style={{ backgroundColor: colores.botonFondo, color: colores.botonTexto, padding: '10px 20px', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Agregar Gasto</button>
    </form>
  )
}
