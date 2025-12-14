import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import GraficoBarrasServicios from '../GraficoBarrasServicios';
import { nombreMes } from '../../utils/formateo'; // solo para mostrar nombre mes

export default function VistaGraficos() {
  const [anio, setAnio] = useState('');
  const [mes, setMes] = useState('');
  const [anios, setAnios] = useState([]);
  const [meses, setMeses] = useState([]);
  const [dataGrafico, setDataGrafico] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ======================
     AÑOS
  ======================= */
  useEffect(() => {
    const fetchAnios = async () => {
      const { data, error } = await supabase.rpc('get_anios_gastos');
      if (!error) setAnios(data);
    };
    fetchAnios();
  }, []);

  /* ======================
     MESES
  ======================= */
  useEffect(() => {
    if (!anio) {
      setMes('');
      setMeses([]);
      return;
    }

    const fetchMeses = async () => {
      const { data, error } = await supabase.rpc('get_meses_por_anio', {
        anio_input: Number(anio),
      });
      if (!error) setMeses(data);
    };

    fetchMeses();
  }, [anio]);

  /* ======================
     GRÁFICO
  ======================= */
  useEffect(() => {
    if (!anio || !mes) {
      setDataGrafico([]);
      return;
    }

    const fetchGrafico = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc(
        'get_gastos_agrupados_por_servicio',
        {
          anio_input: Number(anio),
          mes_input: Number(mes),
        }
      );

      if (!error) setDataGrafico(data);
      setLoading(false);
    };

    fetchGrafico();
  }, [anio, mes]);

  return (
    <div className="vista-contenido">
      <h2>Gráfico de gastos</h2>

      {/* Filtros */}
      <div className="barra-filtros">
        <select value={anio} onChange={e => setAnio(e.target.value)}>
          <option value="">Año</option>
          {anios.map(a => (
            <option key={a.anio} value={a.anio}>
              {a.anio}
            </option>
          ))}
        </select>

        <select
          value={mes}
          onChange={e => setMes(e.target.value)}
          disabled={!anio}
        >
          <option value="">Mes</option>
          {meses.map(m => (
            <option key={m.mes} value={m.mes}>
              {nombreMes(m.mes)} {/* Acá usamos solo para mostrar */}
            </option>
          ))}
        </select>
      </div>

      {/* Contenido */}
      <div className="contenido-principal">
        {!anio || !mes ? (
          <p style={{ textAlign: 'center', marginTop: 40 }}>
            Seleccioná año y mes para ver el gráfico 📊
          </p>
        ) : loading ? (
          <p style={{ textAlign: 'center', marginTop: 40 }}>Cargando gráfico...</p>
        ) : (
          <GraficoBarrasServicios data={dataGrafico} /> // datos sin modificar
        )}
      </div>
    </div>
  );
}
