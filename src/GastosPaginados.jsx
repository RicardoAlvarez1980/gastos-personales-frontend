// GastosPaginados.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const PAGE_LIMIT = 50; // Cantidad de gastos por página

export default function GastosPaginados() {
  const [anios, setAnios] = useState([]);
  const [meses, setMeses] = useState([]);
  const [serviciosMap, setServiciosMap] = useState({});

  const [anioSeleccionado, setAnioSeleccionado] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);

  const [gastos, setGastos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [loading, setLoading] = useState(false);

  // Traer años disponibles al cargar
  useEffect(() => {
    async function cargarAnios() {
      const { data, error } = await supabase.rpc('get_anios_gastos');
      if (error) {
        console.error('Error cargando años:', error);
        return;
      }
      setAnios(data.map(d => d.anio));
      if (data.length > 0) setAnioSeleccionado(data[0].anio);
    }
    cargarAnios();
  }, []);

  // Traer meses cuando cambia año seleccionado
  useEffect(() => {
    if (!anioSeleccionado) return;

    async function cargarMeses() {
      const { data, error } = await supabase.rpc('get_meses_por_anio', { anio_input: anioSeleccionado });
      if (error) {
        console.error('Error cargando meses:', error);
        return;
      }
      setMeses(data.map(d => d.mes));
      if (data.length > 0) setMesSeleccionado(data[0].mes);
      else setMesSeleccionado(null);
    }
    cargarMeses();
  }, [anioSeleccionado]);

  // Traer servicios (una vez)
  useEffect(() => {
    async function cargarServicios() {
      const { data, error } = await supabase.from('servicios').select('*');
      if (error) {
        console.error('Error cargando servicios:', error);
        return;
      }
      const map = {};
      data.forEach(s => {
        map[s.id] = s.nombre;
      });
      setServiciosMap(map);
    }
    cargarServicios();
  }, []);

  // Traer gastos cuando cambia año, mes o página
  useEffect(() => {
    if (!anioSeleccionado || !mesSeleccionado) {
      setGastos([]);
      return;
    }

    async function cargarGastos() {
      setLoading(true);
      const offset = paginaActual * PAGE_LIMIT;

      const { data, error } = await supabase.rpc('get_gastos_por_anio_mes', {
        anio_input: anioSeleccionado,
        mes_input: mesSeleccionado,
        p_limit: PAGE_LIMIT,
        p_offset: offset,
      });

      if (error) {
        console.error('Error cargando gastos:', error);
        setGastos([]);
      } else {
        setGastos(data || []);
      }
      setLoading(false);
    }
    cargarGastos();
  }, [anioSeleccionado, mesSeleccionado, paginaActual]);

  const formatPeso = num =>
    num.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  const totalPaginas = gastos.length < PAGE_LIMIT ? paginaActual + 1 : paginaActual + 2; // No sabemos total, estimamos

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>Gastos Paginados</h2>

      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label>
          Año:{' '}
          <select
            value={anioSeleccionado || ''}
            onChange={e => {
              setAnioSeleccionado(Number(e.target.value));
              setPaginaActual(0);
            }}
          >
            {anios.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <label>
          Mes:{' '}
          <select
            value={mesSeleccionado || ''}
            onChange={e => {
              setMesSeleccionado(Number(e.target.value));
              setPaginaActual(0);
            }}
            disabled={!meses.length}
          >
            {meses.map(m => (
              <option key={m} value={m}>{NOMBRES_MESES[m - 1]}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Cargando gastos...</p>
      ) : gastos.length === 0 ? (
        <p>No hay gastos para mostrar.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 15 }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>ID</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Año</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Mes</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Servicio</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: 8, textAlign: 'right' }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map(g => (
                <tr key={g.id}>
                  <td style={{ padding: 8, textAlign: 'center' }}>{g.id}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{g.año}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{NOMBRES_MESES[g.mes - 1]}</td>
                  <td style={{ padding: 8, textAlign: 'left' }}>{serviciosMap[g.servicio_id] || 'Desconocido'}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>{formatPeso(g.importe)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              disabled={paginaActual === 0}
              onClick={() => setPaginaActual(p => Math.max(p - 1, 0))}
            >
              ← Página anterior
            </button>

            <div>Página {paginaActual + 1}</div>

            <button
              disabled={gastos.length < PAGE_LIMIT}
              onClick={() => setPaginaActual(p => p + 1)}
            >
              Página siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
