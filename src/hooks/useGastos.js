import { useCallback, useEffect, useState } from 'react';
import { actualizarImporteGasto, eliminarGasto } from '../services/gastoMutations';
import { obtenerGastosPorPeriodo, obtenerGastosPorAnio } from '../services/gastosService';

export function useGastos(anio, mes) {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);

  const cargar = useCallback(async () => {
    if (!anio || !mes) { setGastos([]); return; }
    setLoading(true); setError('');
    try {
      setGastos(mes === 'ANUAL' ? await obtenerGastosPorAnio(anio) : await obtenerGastosPorPeriodo(anio, mes));
    } catch (err) { setGastos([]); setError(err.message || 'No se pudieron cargar los gastos.'); }
    finally { setLoading(false); }
  }, [anio, mes]);

  const eliminar = useCallback(async (id) => {
    setError('');
    try { await eliminarGasto(id); await cargar(); return true; }
    catch (err) { setError(err?.message || err?.details || 'No se pudo eliminar el gasto.'); return false; }
  }, [cargar]);

  const editarImporte = useCallback(async (gasto, nuevoImporte) => {
    setEditando(true); setError('');
    try {
      await actualizarImporteGasto({ servicio_id: gasto.servicio_id, año: gasto.año, mes: gasto.mes, importe: Number(nuevoImporte) });
      await cargar();
      return true;
    } catch (err) {
      setError(err?.message || err?.details || 'No se pudo actualizar el importe.');
      return false;
    } finally { setEditando(false); }
  }, [cargar]);

  useEffect(() => { cargar(); }, [cargar]);
  return { gastos, loading, error, recargar: cargar, eliminar, editarImporte, editando };
}
