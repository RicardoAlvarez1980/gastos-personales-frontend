import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from './layout/Sidebar'
import VistaListado from './views/VistaListado'
import VistaGrafico from './views/VistaGrafico'
import FormularioAgregarGasto from '../componentes/FormularioAgregarGasto'
import ModalConfirmacion from '../componentes/ModalConfirmacion'
import serviciosConColores from '../data/serviciosConColores'
import { supabase } from '../supabaseClient'
import ExtenderAniosButton from '../componentes/ExtenderAniosButton'

export default function DashboardPrincipal() {
  const [vistaActiva, setVistaActiva] = useState(null)

  const [gastos, setGastos] = useState([])
  const [servicios, setServicios] = useState([])
  const [aniosDisponibles, setAniosDisponibles] = useState([])
  const [mesesPorAnio, setMesesPorAnio] = useState({})

  const [anioFiltro, setAnioFiltro] = useState('')
  const [mesFiltro, setMesFiltro] = useState('')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10
  const [loading, setLoading] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)
  const [gastoParaModificar, setGastoParaModificar] = useState(null)

  const [resetFormFlag, setResetFormFlag] = useState(false) // Para resetear formulario

  useEffect(() => {
    async function cargarDatos() {
      const { data: serviciosData, error: errS } = await supabase.from('servicios').select('id, nombre')
      if (!errS && serviciosData) {
        const serviciosConColor = serviciosData.map(srv => {
          const found = serviciosConColores.find(sc => sc.nombre === srv.nombre)
          return { ...srv, color: found ? found.color : '#999999' }
        })
        setServicios(serviciosConColor)
      }

      const { data: aniosData, error: errA } = await supabase.rpc('get_anios_gastos')
      if (!errA && aniosData) {
        const añosUnicos = aniosData.map(a => a.anio)
        setAniosDisponibles(añosUnicos)

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
      const query = supabase
        .from('gastos')
        .select('id, servicio_id, año, mes, importe')
        .order('id', { ascending: true })
        .range(pagina * PAGE_SIZE, pagina * PAGE_SIZE + PAGE_SIZE - 1)
      if (anio !== 'ALL') query.eq('año', Number(anio))
      if (mes && mes !== 'ALL') query.eq('mes', Number(mes))

      const res = await query
      data = res.data
      error = res.error
    }

    if (error) {
      console.error('ERROR CARGANDO GASTOS:', error)
      setLoading(false)
      return
    }

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

  useEffect(() => {
    cargarGastos(anioFiltro, mesFiltro, page)
  }, [anioFiltro, mesFiltro, page])

  const cancelarModificacion = () => {
    setModalVisible(false)
    setGastoParaModificar(null)
    setResetFormFlag(true) // Señal para resetear formulario
  }

  const confirmarModificacion = async () => {
    if (!gastoParaModificar) return

    const { nuevo } = gastoParaModificar

    const { error: errUpdate } = await supabase.rpc('actualizar_importe_gasto', {
      _servicio_id: nuevo.servicio_id,
      _año: nuevo.año,
      _mes: nuevo.mes,
      _nuevo_importe: nuevo.importe,
    })

    if (errUpdate) {
      toast.error('Error al actualizar importe.')
    } else {
      toast.success('Importe actualizado correctamente.')
      cargarGastos(anioFiltro, mesFiltro, page)
      setVistaActiva('listado')
    }

    setModalVisible(false)
    setGastoParaModificar(null)
    setResetFormFlag(true) // Resetear formulario tras confirmar
  }

  const agregarGasto = async (nuevo) => {
    try {
      const { data: gastoExistente, error: errCheck } = await supabase.rpc('verificar_gasto_existente', {
        _servicio_id: nuevo.servicio_id,
        _año: nuevo.año,
        _mes: nuevo.mes,
      })

      if (errCheck) {
        toast.error('Error al verificar gasto existente.')
        return
      }

      if (gastoExistente && gastoExistente.length > 0) {
        setGastoParaModificar({ existente: gastoExistente[0], nuevo })
        setModalVisible(true)
        return
      }

      const { data, error } = await supabase.rpc('insertar_gasto', {
        _servicio_id: nuevo.servicio_id,
        _año: nuevo.año,
        _mes: nuevo.mes,
        _importe: nuevo.importe,
      })

      if (error) {
        toast.error('Error al agregar gasto en la base de datos.')
        return
      }

      if (data && data.length > 0) {
        toast.success('Gasto guardado correctamente en la base!')
        cargarGastos(anioFiltro, mesFiltro, page)
        setVistaActiva('listado')
      } else {
        toast.error('No se pudo agregar el gasto, respuesta vacía.')
      }
    } catch (error) {
      toast.error('Error inesperado: ' + error.message)
    }
  }

  const eliminarGasto = async (id) => {
    const { error } = await supabase.rpc('eliminar_gasto', { _id: id })
    if (error) {
      toast.error('Error al eliminar gasto.')
      console.error(error)
    } else {
      toast.success('Gasto eliminado correctamente.')
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
          <>
            <ModalConfirmacion
              visible={modalVisible}
              mensaje={
                gastoParaModificar
                  ? `Ya existe un gasto para ese año, mes y servicio con importe ${gastoParaModificar.existente.importe}. ` +
                    `¿Querés modificarlo al nuevo importe ${gastoParaModificar.nuevo.importe}?`
                  : ''
              }
              onConfirmar={confirmarModificacion}
              onCancelar={cancelarModificacion}
              colores={colores}
            />
            <div style={{ marginBottom: 20 }}>
              <ExtenderAniosButton anioBase={Math.max(...aniosDisponibles)} />
            </div>
            <FormularioAgregarGasto
              gastos={gastos}
              servicios={servicios}
              aniosDisponibles={aniosDisponibles}
              mesesPorAnio={mesesPorAnio}
              onAgregar={agregarGasto}
              colores={colores}
              resetFlag={resetFormFlag}        // Le paso el flag
              onResetHandled={() => setResetFormFlag(false)} // Limpio flag después del reset
            />
          </>
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
