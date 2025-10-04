import React, { useEffect, useState, useCallback, useMemo } from 'react';
import GraficoGastos from './GraficoGastos';
import Navbar from './Navbar';
import AgregarGasto from './AgregarGasto';

const API_BASE_URL = 'https://api-gastos-tlyv.onrender.com';

export default function App() {
  const [gastosCompletos, setGastosCompletos] = useState([]);
  const [porAño, setPorAño] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState('');
  const [cargando, setCargando] = useState(false);
  const [view, setView] = useState('todos');
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  
  // Estados para edición
  const [editandoGasto, setEditandoGasto] = useState(null);
  
  // Estados para búsqueda
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [criterioBusqueda, setCriterioBusqueda] = useState({
    servicio: '',
    año: '',
    mes: '',
    importeMin: '',
    importeMax: ''
  });

  const [totalesAnuales, setTotalesAnuales] = useState({});
  const [totalesGlobales, setTotalesGlobales] = useState([]);
  const [totalesMensuales, setTotalesMensuales] = useState([]);

  const añosDisponibles = useMemo(() => 
    [...new Set(gastosCompletos.map(g => g.año))].sort((a, b) => b - a),
    [gastosCompletos]
  );

  // Formatear números
  const formatNumber = useCallback((num) => {
    return (num || 0).toLocaleString('es-AR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }, []);

  // Manejo genérico de errores
  const handleError = useCallback((error, contexto) => {
    console.error(`Error en ${contexto}:`, error);
    setError(`Error al cargar ${contexto}: ${error.message}`);
  }, []);

  // Traer todos los gastos completos
  useEffect(() => {
    let isMounted = true;

    async function fetchGastosCompletos() {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/gastos?completo=true`);
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        
        if (isMounted) {
          setGastosCompletos(data.gastos || []);
          if (data.gastos && data.gastos.length > 0) {
            const años = [...new Set(data.gastos.map(g => g.año))].sort((a, b) => b - a);
            setAñoSeleccionado(años[0]);
          }
        }
      } catch (e) {
        if (isMounted) {
          handleError(e, 'gastos completos');
        }
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    }
    
    fetchGastosCompletos();

    return () => {
      isMounted = false;
    };
  }, [handleError]);

  // Traer gastos por año
  useEffect(() => {
    if (!añoSeleccionado || view !== 'porAño') return;

    let isMounted = true;

    async function fetchGastosPorAño() {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/gastos?año=${encodeURIComponent(añoSeleccionado)}&completo=true`
        );
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        
        if (isMounted) {
          setPorAño(data.gastos || []);
        }
      } catch (e) {
        if (isMounted) {
          handleError(e, `gastos del año ${añoSeleccionado}`);
          setPorAño([]);
        }
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    }

    fetchGastosPorAño();

    return () => {
      isMounted = false;
    };
  }, [añoSeleccionado, view, handleError]);

  // Traer servicios
  useEffect(() => {
    let isMounted = true;

    async function fetchServicios() {
      try {
        const res = await fetch(`${API_BASE_URL}/servicios`);
        if (!res.ok) {
          const texto = await res.text();
          throw new Error(`HTTP ${res.status}: ${texto.slice(0, 200)}`);
        }
        const data = await res.json();
        
        if (isMounted) {
          setServicios(data);
        }
      } catch (e) {
        if (isMounted) {
          handleError(e, 'servicios');
        }
      }
    }
    
    fetchServicios();

    return () => {
      isMounted = false;
    };
  }, [handleError]);

  // Traer totales anuales por servicio
  useEffect(() => {
    if (view !== 'totales') return;

    let isMounted = true;

    async function fetchTotalesAnuales() {
      try {
        const res = await fetch(`${API_BASE_URL}/totales/anuales`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (isMounted) {
          setTotalesAnuales(data);
        }
      } catch (e) {
        if (isMounted) {
          handleError(e, 'totales anuales');
        }
      }
    }
    
    fetchTotalesAnuales();

    return () => {
      isMounted = false;
    };
  }, [view, handleError]);

  // Traer totales globales anuales
  useEffect(() => {
    if (view !== 'totales') return;

    let isMounted = true;

    async function fetchTotalesGlobales() {
      try {
        const res = await fetch(`${API_BASE_URL}/totales/globales-anuales`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (isMounted) {
          setTotalesGlobales(data);
        }
      } catch (e) {
        if (isMounted) {
          handleError(e, 'totales globales');
        }
      }
    }
    
    fetchTotalesGlobales();

    return () => {
      isMounted = false;
    };
  }, [view, handleError]);

  // Traer totales mensuales
  useEffect(() => {
    if (view !== 'totales') return;

    let isMounted = true;

    async function fetchTotalesMensuales() {
      try {
        const res = await fetch(`${API_BASE_URL}/totales/mensuales-todos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        if (isMounted) {
          setTotalesMensuales(data);
        }
      } catch (e) {
        if (isMounted) {
          handleError(e, 'totales mensuales');
        }
      }
    }
    
    fetchTotalesMensuales();

    return () => {
      isMounted = false;
    };
  }, [view, handleError]);

  // Agregar gasto desde el formulario
  const handleAddGasto = async (nuevoGasto) => {
    try {
      setCargando(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoGasto),
      });
      
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || res.statusText);
      }
      
      const gastoCreado = await res.json();

      // Mapear servicio_id a nombre de servicio
      const servicioNombre = servicios.find(s => s.id === gastoCreado.servicio_id)?.nombre || 'Desconocido';
      const gastoConNombre = { ...gastoCreado, servicio: servicioNombre };

      setGastosCompletos(prev => [...prev, gastoConNombre]);
      setView('todos');
      alert('Gasto agregado correctamente');
    } catch (e) {
      setError(`Error al agregar gasto: ${e.message}`);
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  // Eliminar gasto
  const handleDeleteGasto = async (gastoId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      return;
    }

    try {
      setCargando(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/gastos/${gastoId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || res.statusText);
      }

      // Actualizar estado local eliminando el gasto
      setGastosCompletos(prev => prev.filter(g => g.id !== gastoId));
      setPorAño(prev => prev.filter(g => g.id !== gastoId));
      setResultadosBusqueda(prev => prev.filter(g => g.id !== gastoId));
      
      alert('Gasto eliminado correctamente');
    } catch (e) {
      setError(`Error al eliminar gasto: ${e.message}`);
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  // Editar gasto
  const handleEditGasto = async (gastoActualizado) => {
    try {
      setCargando(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/gastos/${gastoActualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicio_id: Number(gastoActualizado.servicio_id),
          año: Number(gastoActualizado.año),
          mes: Number(gastoActualizado.mes),
          importe: parseFloat(gastoActualizado.importe),
        }),
      });
      
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || res.statusText);
      }
      
      const gastoEditado = await res.json();
      const servicioNombre = servicios.find(s => s.id === gastoEditado.servicio_id)?.nombre || 'Desconocido';
      const gastoConNombre = { ...gastoEditado, servicio: servicioNombre };

      // Actualizar en todos los estados
      setGastosCompletos(prev => prev.map(g => g.id === gastoEditado.id ? gastoConNombre : g));
      setPorAño(prev => prev.map(g => g.id === gastoEditado.id ? gastoConNombre : g));
      setResultadosBusqueda(prev => prev.map(g => g.id === gastoEditado.id ? gastoConNombre : g));
      
      setEditandoGasto(null);
      alert('Gasto actualizado correctamente');
    } catch (e) {
      setError(`Error al editar gasto: ${e.message}`);
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  // Buscar gastos
  const handleBuscarGastos = () => {
    let resultados = [...gastosCompletos];

    // Filtrar por servicio
    if (criterioBusqueda.servicio) {
      resultados = resultados.filter(g => 
        g.servicio?.toLowerCase().includes(criterioBusqueda.servicio.toLowerCase())
      );
    }

    // Filtrar por año
    if (criterioBusqueda.año) {
      resultados = resultados.filter(g => g.año === Number(criterioBusqueda.año));
    }

    // Filtrar por mes
    if (criterioBusqueda.mes) {
      resultados = resultados.filter(g => g.mes === Number(criterioBusqueda.mes));
    }

    // Filtrar por importe mínimo
    if (criterioBusqueda.importeMin) {
      resultados = resultados.filter(g => 
        parseFloat(g.importe) >= parseFloat(criterioBusqueda.importeMin)
      );
    }

    // Filtrar por importe máximo
    if (criterioBusqueda.importeMax) {
      resultados = resultados.filter(g => 
        parseFloat(g.importe) <= parseFloat(criterioBusqueda.importeMax)
      );
    }

    setResultadosBusqueda(resultados);
  };

  // Limpiar búsqueda
  const handleLimpiarBusqueda = () => {
    setCriterioBusqueda({
      servicio: '',
      año: '',
      mes: '',
      importeMin: '',
      importeMax: ''
    });
    setResultadosBusqueda([]);
  };

  return (
    <div className="app-container">
      <Navbar view={view} setView={setView} />

      {error && (
        <div className="alert" style={{ 
          backgroundColor: '#fee', 
          color: '#c00', 
          padding: '1rem', 
          marginBottom: '1rem',
          borderRadius: '4px',
          maxWidth: '1400px',
          margin: '0 auto 1rem auto'
        }}>
          {error}
        </div>
      )}

      <main className="app-content" role="tabpanel" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Vista: Todos */}
        {view === 'todos' && (
          cargando && gastosCompletos.length === 0 ? (
            <div className="loading">Cargando...</div>
          ) : gastosCompletos.length === 0 ? (
            <div className="alert">No hay datos.</div>
          ) : (
            <div className="table-wrapper">
              <table className="table" aria-label="Tabla de todos los gastos">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Año</th>
                    <th>Mes</th>
                    <th>Importe</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosCompletos.map((g, i) => (
                    editandoGasto?.id === g.id ? (
                      <tr key={`${g.año}-${g.mes}-${g.servicio}-${i}`}>
                        <td>
                          <select
                            value={editandoGasto.servicio_id}
                            onChange={e => setEditandoGasto({...editandoGasto, servicio_id: e.target.value})}
                            style={{ width: '100%', padding: '0.3rem' }}
                          >
                            {servicios.map(s => (
                              <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editandoGasto.año}
                            onChange={e => setEditandoGasto({...editandoGasto, año: e.target.value})}
                            style={{ width: '80px', padding: '0.3rem' }}
                            min="2000"
                            max="2050"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editandoGasto.mes}
                            onChange={e => setEditandoGasto({...editandoGasto, mes: e.target.value})}
                            style={{ width: '60px', padding: '0.3rem' }}
                            min="1"
                            max="12"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={editandoGasto.importe}
                            onChange={e => setEditandoGasto({...editandoGasto, importe: e.target.value})}
                            style={{ width: '100px', padding: '0.3rem' }}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleEditGasto(editandoGasto)}
                            disabled={cargando}
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              marginRight: '0.5rem'
                            }}
                          >
                            ✅ Guardar
                          </button>
                          <button
                            onClick={() => setEditandoGasto(null)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            ❌ Cancelar
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={`${g.año}-${g.mes}-${g.servicio}-${i}`}>
                        <td>{g.servicio}</td>
                        <td>{g.año}</td>
                        <td>{g.mes.toString().padStart(2, '0')}</td>
                        <td>${formatNumber(parseFloat(g.importe))}</td>
                        <td>
                          <button
                            onClick={() => setEditandoGasto({
                              id: g.id,
                              servicio_id: servicios.find(s => s.nombre === g.servicio)?.id || '',
                              año: g.año,
                              mes: g.mes,
                              importe: g.importe
                            })}
                            disabled={cargando}
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: cargando ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              marginRight: '0.5rem'
                            }}
                            onMouseOver={e => !cargando && (e.target.style.backgroundColor = '#0056b3')}
                            onMouseOut={e => !cargando && (e.target.style.backgroundColor = '#007bff')}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteGasto(g.id)}
                            disabled={cargando}
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: cargando ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}
                            onMouseOver={e => !cargando && (e.target.style.backgroundColor = '#c82333')}
                            onMouseOut={e => !cargando && (e.target.style.backgroundColor = '#dc3545')}
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Vista: Por Año */}
        {view === 'porAño' && (
          cargando ? (
            <div className="loading">Cargando...</div>
          ) : porAño.length === 0 ? (
            <div className="alert">No hay datos para este año.</div>
          ) : (
            <GraficoGastos
              porAño={porAño}
              añoSeleccionado={añoSeleccionado}
              añosDisponibles={añosDisponibles}
              onCambiarAño={setAñoSeleccionado}
              onDeleteGasto={handleDeleteGasto}
              cargando={cargando}
            />
          )
        )}

        {/* Vista: Agregar Gasto */}
        {view === 'agregar' && (
          <AgregarGasto servicios={servicios} addGasto={handleAddGasto} />
        )}

        {/* Vista: Buscar */}
        {view === 'buscar' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              🔍 Buscar Gastos
            </h3>
            
            {/* Formulario de búsqueda */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Servicio:
                  </label>
                  <select
                    value={criterioBusqueda.servicio}
                    onChange={e => setCriterioBusqueda({...criterioBusqueda, servicio: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  >
                    <option value="">Todos</option>
                    {servicios.map(s => (
                      <option key={s.id} value={s.nombre}>{s.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Año:
                  </label>
                  <input
                    type="number"
                    value={criterioBusqueda.año}
                    onChange={e => setCriterioBusqueda({...criterioBusqueda, año: e.target.value})}
                    placeholder="Ej: 2024"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Mes:
                  </label>
                  <input
                    type="number"
                    value={criterioBusqueda.mes}
                    onChange={e => setCriterioBusqueda({...criterioBusqueda, mes: e.target.value})}
                    placeholder="1-12"
                    min="1"
                    max="12"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Importe Mín:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={criterioBusqueda.importeMin}
                    onChange={e => setCriterioBusqueda({...criterioBusqueda, importeMin: e.target.value})}
                    placeholder="$0.00"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Importe Máx:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={criterioBusqueda.importeMax}
                    onChange={e => setCriterioBusqueda({...criterioBusqueda, importeMax: e.target.value})}
                    placeholder="$99999.99"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                <button
                  onClick={handleBuscarGastos}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={e => e.target.style.backgroundColor = '#007bff'}
                >
                  🔍 Buscar
                </button>
                <button
                  onClick={handleLimpiarBusqueda}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#5a6268'}
                  onMouseOut={e => e.target.style.backgroundColor = '#6c757d'}
                >
                  🔄 Limpiar
                </button>
              </div>
            </div>

            {/* Resultados de búsqueda */}
            {resultadosBusqueda.length > 0 ? (
              <div>
                <h4 style={{ marginBottom: '1rem' }}>
                  Resultados: {resultadosBusqueda.length} gasto(s) encontrado(s)
                </h4>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th>Año</th>
                        <th>Mes</th>
                        <th>Importe</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadosBusqueda.map((g, i) => (
                        editandoGasto?.id === g.id ? (
                          <tr key={`busqueda-${g.id}-${i}`}>
                            <td>
                              <select
                                value={editandoGasto.servicio_id}
                                onChange={e => setEditandoGasto({...editandoGasto, servicio_id: e.target.value})}
                                style={{ width: '100%', padding: '0.3rem' }}
                              >
                                {servicios.map(s => (
                                  <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                value={editandoGasto.año}
                                onChange={e => setEditandoGasto({...editandoGasto, año: e.target.value})}
                                style={{ width: '80px', padding: '0.3rem' }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={editandoGasto.mes}
                                onChange={e => setEditandoGasto({...editandoGasto, mes: e.target.value})}
                                style={{ width: '60px', padding: '0.3rem' }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                value={editandoGasto.importe}
                                onChange={e => setEditandoGasto({...editandoGasto, importe: e.target.value})}
                                style={{ width: '100px', padding: '0.3rem' }}
                              />
                            </td>
                            <td>
                              <button
                                onClick={() => handleEditGasto(editandoGasto)}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem',
                                  marginRight: '0.5rem'
                                }}
                              >
                                ✅ Guardar
                              </button>
                              <button
                                onClick={() => setEditandoGasto(null)}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  backgroundColor: '#6c757d',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                ❌ Cancelar
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr key={`busqueda-${g.id}-${i}`}>
                            <td>{g.servicio}</td>
                            <td>{g.año}</td>
                            <td>{g.mes.toString().padStart(2, '0')}</td>
                            <td>${formatNumber(parseFloat(g.importe))}</td>
                            <td>
                              <button
                                onClick={() => setEditandoGasto({
                                  id: g.id,
                                  servicio_id: servicios.find(s => s.nombre === g.servicio)?.id || '',
                                  año: g.año,
                                  mes: g.mes,
                                  importe: g.importe
                                })}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  backgroundColor: '#007bff',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem',
                                  marginRight: '0.5rem'
                                }}
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleDeleteGasto(g.id)}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                🗑️ Eliminar
                              </button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : criterioBusqueda.servicio || criterioBusqueda.año || criterioBusqueda.mes || criterioBusqueda.importeMin || criterioBusqueda.importeMax ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: '#fff3cd',
                borderRadius: '8px'
              }}>
                No se encontraron gastos con los criterios especificados.
              </div>
            ) : null}
          </div>
        )}

        {/* Vista: Totales */}
        {view === 'totales' && (
          cargando ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="totales-wrapper">
              <h3>Totales Anuales por Servicio</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Año</th>
                    {servicios.map(s => (
                      <th key={s.id}>{s.nombre}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(totalesAnuales).sort((a, b) => a - b).map(año => (
                    <tr key={año}>
                      <td>{año}</td>
                      {servicios.map(s => (
                        <td key={s.id}>
                          ${formatNumber(totalesAnuales[año]?.[s.nombre] || 0)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Totales Globales Anuales</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {totalesGlobales.map((t, i) => (
                    <tr key={`${t.año}-${i}`}>
                      <td>{t.año}</td>
                      <td>${formatNumber(t.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Totales Mensuales</h3>
              {totalesMensuales.map(({ año, meses }) => (
                <div key={año} style={{ marginBottom: '2rem' }}>
                  <h4>Año {año}</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Mes</th>
                        {servicios.map(s => <th key={s.id}>{s.nombre}</th>)}
                        <th>Total Mensual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meses.map(({ mes, totalPorServicio, totalMensual }) => (
                        <tr key={mes}>
                          <td>{mes.toString().padStart(2, '0')}</td>
                          {servicios.map(s => (
                            <td key={s.id}>
                              ${formatNumber(totalPorServicio?.[s.nombre] || 0)}
                            </td>
                          ))}
                          <td>${formatNumber(totalMensual)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}