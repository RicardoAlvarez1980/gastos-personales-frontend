// GastosListado.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function GastosListado() {
  const [gastos, setGastos] = useState([]);
  const [serviciosMap, setServiciosMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDatos() {
      setLoading(true);

      // Traer servicios para mapear id -> nombre
      const { data: servicios, error: serviciosError } = await supabase
        .from('servicios')
        .select('*');

      if (serviciosError) {
        console.error('Error cargando servicios:', serviciosError);
        setLoading(false);
        return;
      }

      // Crear map id->nombre para buscar rápido
      const mapServicios = {};
      servicios.forEach(s => {
        mapServicios[s.id] = s.nombre;
      });
      setServiciosMap(mapServicios);

      // Traer gastos ordenados por año asc y mes asc
      const { data: gastosData, error: gastosError } = await supabase
        .from('gastos')
        .select('*')
        .order('año', { ascending: true })
        .order('mes', { ascending: true });

      if (gastosError) {
        console.error('Error cargando gastos:', gastosError);
        setLoading(false);
        return;
      }

      setGastos(gastosData || []);
      setLoading(false);
    }

    fetchDatos();
  }, []);

  const formatPeso = (num) =>
    num.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  if (loading) return <p>Cargando gastos...</p>;
  if (!gastos.length) return <p>No hay gastos para mostrar.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Año</th>
          <th>Mes</th>
          <th>Servicio</th>
          <th>Importe</th>
        </tr>
      </thead>
      <tbody>
        {gastos.map(g => (
          <tr key={g.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '8px', textAlign: 'center' }}>{g.año}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{NOMBRES_MESES[g.mes - 1]}</td>
            <td style={{ padding: '8px', textAlign: 'left' }}>{serviciosMap[g.servicio_id] || 'Desconocido'}</td>
            <td style={{ padding: '8px', textAlign: 'right' }}>{formatPeso(g.importe)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
