import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SelectorAniosMeses from './SelectorAniosMeses';
import GraficoBarras from './GraficoBarras';

export default function GastosDashboard() {
  const [anios, setAnios] = useState([]);
  const [meses, setMeses] = useState([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [gastosPorServicio, setGastosPorServicio] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar años disponibles
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

  // Cargar meses cuando cambia año
  useEffect(() => {
    if (!anioSeleccionado) return;

    async function cargarMeses() {
      const { data, error } = await supabase.rpc('get_meses_por_anio', { anio_input: anioSeleccionado });
      if (error) {
        console.error('Error cargando meses:', error);
        setMeses([]);
        setMesSeleccionado(null);
        return;
      }
      setMeses(data.map(d => d.mes));
      if (data.length > 0) setMesSeleccionado(data[0].mes);
      else setMesSeleccionado(null);
    }
    cargarMeses();
  }, [anioSeleccionado]);

  // Cargar gastos agrupados por servicio para el gráfico
  useEffect(() => {
    if (!anioSeleccionado || !mesSeleccionado) {
      setGastosPorServicio([]);
      return;
    }

    async function cargarGastos() {
      setLoading(true);
      // Aquí necesitas una RPC que devuelva gastos sumados por servicio para un año y mes
      // Supongamos que la llamamos 'get_gastos_agrupados_por_servicio'
      const { data, error } = await supabase.rpc('get_gastos_agrupados_por_servicio', {
        anio_input: anioSeleccionado,
        mes_input: mesSeleccionado
      });
      if (error) {
        console.error('Error cargando gastos agrupados:', error);
        setGastosPorServicio([]);
      } else {
        setGastosPorServicio(data || []);
      }
      setLoading(false);
    }
    cargarGastos();
  }, [anioSeleccionado, mesSeleccionado]);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Gastos Mensuales por Servicio</h2>

      <SelectorAniosMeses
        anios={anios}
        meses={meses}
        anioSeleccionado={anioSeleccionado}
        mesSeleccionado={mesSeleccionado}
        setAnioSeleccionado={setAnioSeleccionado}
        setMesSeleccionado={setMesSeleccionado}
      />

      {loading ? <p>Cargando datos para gráfico...</p> : null}

      {!loading && gastosPorServicio.length === 0 && <p>No hay datos para mostrar.</p>}

      {gastosPorServicio.length > 0 && <GraficoBarras data={gastosPorServicio} />}
    </div>
  );
}
