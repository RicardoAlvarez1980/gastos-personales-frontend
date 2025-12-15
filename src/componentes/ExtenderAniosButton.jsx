import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { supabase } from '../supabaseClient'

export default function ExtenderAniosButton({ anioBase }) {
  const [loading, setLoading] = useState(false)

  const extenderAnios = async () => {
    if (loading) return
    setLoading(true)
    try {
      const { error } = await supabase.rpc('extender_años_desde_filtrando_servicios', {
        _anio_base: anioBase,
        _cantidad_anios: 5, // Puedes cambiar la cantidad aquí si querés
      })
      if (error) {
        toast.error('Error al extender años: ' + error.message)
      } else {
        toast.success(`Se agregaron 5 años adicionales desde ${anioBase + 1} en adelante.`)
      }
    } catch (err) {
      toast.error('Error inesperado: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={extenderAnios}
      disabled={loading}
      style={{
        padding: '10px 20px',
        backgroundColor: loading ? '#ccc' : '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
      title="Extender años en gastos para servicios usados"
    >
      {loading ? 'Extendiéndose...' : 'Extender 5 años desde año base'}
    </button>
  )
}
