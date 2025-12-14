import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from './layout/Sidebar'
import VistaListado from './views/VistaListado'
import VistaGrafico from './views/VistaGrafico'
import FormularioAgregarGasto from '../componentes/FormularioAgregarGasto'
import serviciosConColores from '../data/serviciosConColores'
import { supabase } from '../supabaseClient'

export default function DashboardPrincipal() {
  const [vistaActiva, setVistaActiva] = useState(null)

  const [gastos, setGastos] = useState([])
  const [servicios, setServicios] = useState([])
  const [aniosDisponibles, setAniosDisponibles] = useState([])
  const [mesesPorAnio, setMesesPorAnio] = useState({})

  // Para filtros que usará VistaListado
  const [anioFiltro, setAnioFiltro] = useState('')
  const [mesFiltro, setMesFiltro] = useState('')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10
  const [loading, setLoading] = useState(false)

  // Carga servicios, años, meses (una sola vez)
  useEffect(() => {
    async function cargarDatos() {
      // Servicios
      const { data: serviciosData, error: errS } = await supabase.from('servicios').select('id, nombre')
      if (!errS && serviciosData) {
        const serviciosConColor = serviciosData.map(srv => {
          const found = serviciosConColores.find(sc => sc.nombre === srv.nombre)
          return { ...srv, color: found ? found.color : '#999999' }
        })
        setServicios(serviciosConColor)
      }

      // Años vía RPC
      const { data: aniosData, error: errA } = await supabase.rpc('get_anios_gastos')
      if (!errA && aniosData) {
        const añosUnicos = aniosData.map(a => a.anio)
        setAniosDisponibles(añosUnicos)

        // Meses por año
        const mesesMap = {}
        for (const anio of añosUnicos) {
          const { data: mesesData, error: errM } = await supabase.rpc('get_meses_por_anio', { anio_input: anio })
          if (!errM && mesesData) {
            mesesMap[anio] = mesesData.map(m => m.mes)
          }
        }
        setMesesPorAnio(mesesMap)
      }
    }

    cargarDatos()
  }, [])

  // Función para cargar gastos con filtros y paginado
  const cargarGastos = async (anio, mes, pagina) => {
    if (!anio) {
      setGastos([])
      return
    }
    setLoading(true)
    let data, error

    if (anio !== 'ALL' && mes && mes !== 'ALL') {
      const res = await supabase.rpc('get_gastos_por_anio_mes', {
        anio_input: Number(anio),
        mes_input: Number(mes),
        p_limit: PAGE_SIZE,
        p_offset: pagina * PAGE_SIZE,
      })
      data = res.data
      error = res.error
    } else {
      let query = supabase
        .from('gastos')
        .select('id, servicio_id, año, mes, importe')
        .order('id', { ascending: true })
        .range(pagina * PAGE_SIZE, pagina * PAGE_SIZE + PAGE_SIZE - 1)

      if (anio !== 'ALL') query = query.eq('año', Number(anio))
      if (mes && mes !== 'ALL') query = query.eq('mes', Number(mes))

      const res = await query
      data = res.data
      error = res.error
    }

    if (error) {
      console.error('ERROR CARGANDO GASTOS:', error)
      setLoading(false)
      return
    }

    // Nombres de servicios
    const servicioIds = [...new Set(data.map(g => g.servicio_id))]
    const { data: serviciosData } = await supabase
      .from('servicios')
      .select('id, nombre')
      .in('id', servicioIds)
    const serviciosMap = Object.fromEntries(serviciosData.map(s => [s.id, s.nombre]))

    const gastosConNombre = data.map(g => ({
      ...g,
      servicio_nombre: serviciosMap[g.servicio_id] || 'Sin servicio',
    }))

    setGastos(gastosConNombre)
    setLoading(false)
  }

  // Cargar gastos cuando cambien filtros o paginado
  useEffect(() => {
    cargarGastos(anioFiltro, mesFiltro, page)
  }, [anioFiltro, mesFiltro, page])

  // Agregar gasto
  const agregarGasto = async (nuevo) => {
    const { data, error } = await supabase.rpc('insertar_gasto', {
      _servicio_id: nuevo.servicio_id,
      _año: nuevo.año,
      _mes: nuevo.mes,
      _importe: nuevo.importe,
    })

    if (error) {
      console.error('Error al insertar gasto vía RPC:', error)
      toast.error('Error al agregar gasto en la base de datos.')
      return
    }

    if (data && data.length > 0) {
      toast.success('Gasto guardado correctamente en la base!')
      // Recargar gastos para reflejar cambios
      cargarGastos(anioFiltro, mesFiltro, page)
      setVistaActiva('listado')
    } else {
      toast.error('No se pudo agregar el gasto, respuesta vacía.')
    }
  }

  // Eliminar gasto
  const eliminarGasto = async (id) => {
    const { error } = await supabase.from('gastos').delete().eq('id', id)
    if (error) {
      toast.error('Error al eliminar gasto.')
      console.error(error)
    } else {
      toast.success('Gasto eliminado correctamente.')
      // Recargar gastos
      cargarGastos(anioFiltro, mesFiltro, page)
    }
  }

  const colores = {
    texto: '#222',
    botonFondo: '#007bff',
    botonHover: '#0056b3',
    botonTexto: '#fff',
    fondoForm: '#f0f4f8',
  }

  const renderVista = () => {
    switch (vistaActiva) {
      case 'listado':
        return (
          <VistaListado
            gastos={gastos}
            anios={aniosDisponibles}
            anioSeleccionado={anioFiltro}
            setAnioSeleccionado={setAnioFiltro}
            mesSeleccionado={mesFiltro}
            setMesSeleccionado={setMesFiltro}
            page={page}
            setPage={setPage}
            loading={loading}
            onEliminar={eliminarGasto}
          />
        )
      case 'graficos':
        return <VistaGrafico gastos={gastos} />
      case 'agregar':
        return (
          <FormularioAgregarGasto
            gastos={gastos}
            servicios={servicios}
            aniosDisponibles={aniosDisponibles}
            mesesPorAnio={mesesPorAnio}
            onAgregar={agregarGasto}
            colores={colores}
          />
        )
      default:
        return (
          <div style={{ opacity: 0.6, textAlign: 'center', marginTop: 40, fontSize: 16 }}>
            Seleccioná una opción del menú 👈
          </div>
        )
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar setVistaActiva={setVistaActiva} />
      <main style={{ flex: 1, padding: '1rem' }}>{renderVista()}</main>
    </div>
  )
}
