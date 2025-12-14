import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { formatearNombreServicio, nombreMes } from '../utils/formateo.js'  // ajustá ruta

export default function FormularioAgregarGasto({
  gastos,
  servicios,
  aniosDisponibles,
  mesesPorAnio,
  onAgregar,
  colores,
}) {
  const [nuevoGasto, setNuevoGasto] = useState({
    año: '',
    mes: '',
    servicio_id: '',
    importe: '',
  })
  const [confirmarModificacion, setConfirmarModificacion] = useState(false)

  useEffect(() => {
    setNuevoGasto(prev => ({ ...prev, mes: '', servicio_id: '' }))
    setConfirmarModificacion(false)
  }, [nuevoGasto.año])

  const existeGasto = (año, mes, servicioId) =>
    gastos.some(
      g =>
        g.año === Number(año) &&
        g.mes === Number(mes) &&
        g.servicio_id === Number(servicioId)
    )

  const handleChange = e => {
    const { name, value } = e.target
    setNuevoGasto(prev => ({ ...prev, [name]: value }))
    setConfirmarModificacion(false)
  }

  const handleModificar = () => {
    toast.info('Funcionalidad modificar pendiente')
  }

  const handleSubmit = e => {
    e.preventDefault()
    const { año, mes, servicio_id, importe } = nuevoGasto
    if (!año || !mes || !servicio_id || !importe) {
      toast.error('Por favor, completá todos los campos.')
      return
    }
    if (existeGasto(año, mes, servicio_id)) {
      // Buscar nombre para mostrar bonito
      const servicio = servicios.find(s => s.id === Number(servicio_id))
      toast.error(`El gasto "${formatearNombreServicio(servicio?.nombre)}" para ${nombreMes(Number(mes))}/${año} ya existe.`)
      setConfirmarModificacion(true)
      return
    }
    onAgregar({
      año: Number(año),
      mes: Number(mes),
      servicio_id: Number(servicio_id),
      importe: Number(importe),
    })
    toast.success('Gasto agregado correctamente!')
    setNuevoGasto({ año: '', mes: '', servicio_id: '', importe: '' })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 20,
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          color: colores.texto,
          backgroundColor: colores.fondoForm,
          padding: 16,
          borderRadius: 8,
        }}
      >
        {/* Año */}
        <select
          name="año"
          value={nuevoGasto.año}
          onChange={handleChange}
          style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}
        >
          <option value="">Seleccioná año</option>
          {aniosDisponibles.map(año => (
            <option key={año} value={año}>
              {año}
            </option>
          ))}
        </select>

        {/* Mes */}
        <select
          name="mes"
          value={nuevoGasto.mes}
          onChange={handleChange}
          disabled={!nuevoGasto.año}
          style={{
            padding: 6,
            borderRadius: 4,
            border: '1px solid #ccc',
            minWidth: 120,
            opacity: nuevoGasto.año ? 1 : 0.6,
          }}
        >
          <option value="">Seleccioná mes</option>
          {(mesesPorAnio[nuevoGasto.año] || []).map(mes => (
            <option key={mes} value={mes}>
              {mes.toString().padStart(2, '0')}
            </option>
          ))}
        </select>

        {/* Servicio */}
        <select
          name="servicio_id"
          value={nuevoGasto.servicio_id}
          onChange={handleChange}
          disabled={!nuevoGasto.mes}
          style={{
            padding: 6,
            borderRadius: 4,
            border: '1px solid #ccc',
            minWidth: 150,
            opacity: nuevoGasto.mes ? 1 : 0.6,
          }}
        >
          <option value="">Seleccioná servicio</option>
          {servicios.map(srv => (
            <option key={srv.id} value={srv.id}>
              {formatearNombreServicio(srv.nombre)}
            </option>
          ))}
        </select>

        {/* Importe */}
        <input
          type="number"
          name="importe"
          placeholder="Importe"
          value={nuevoGasto.importe}
          onChange={handleChange}
          min="0"
          step="0.01"
          disabled={!nuevoGasto.servicio_id}
          style={{
            padding: 6,
            borderRadius: 4,
            border: '1px solid #ccc',
            width: 120,
            opacity: nuevoGasto.servicio_id ? 1 : 0.6,
          }}
        />

        <button
          type="submit"
          disabled={!nuevoGasto.importe || !nuevoGasto.servicio_id}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            backgroundColor: colores.botonFondo,
            color: colores.botonTexto,
            border: 'none',
            opacity: nuevoGasto.importe && nuevoGasto.servicio_id ? 1 : 0.6,
          }}
        >
          Agregar gasto
        </button>
      </form>

      {confirmarModificacion && (
        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              marginTop: 6,
              padding: '4px 10px',
              cursor: 'pointer',
              backgroundColor: '#c00',
              color: 'white',
              border: 'none',
              borderRadius: 4,
            }}
            onClick={handleModificar}
          >
            Modificar gasto existente
          </button>
        </div>
      )}
    </>
  )
}
