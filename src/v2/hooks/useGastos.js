import { useCallback, useEffect, useState } from 'react';
import { obtenerGastosPorPeriodo } from '../services/gastosService';
import { eliminarGasto } from '../services/gastoMutations';

export function useGastos(anio, mes) {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    if (!anio || !mes) { setGastos([]); return; }
    setLoading(true); setError('');
    try { setGastos(await obtenerGastosPorPeriodo(anio, mes)); }
    catch (err) { setGastos([]); setError(err.message || 'No se pudieron cargar los gastos.'); }
    finally { setLoading(false); }
  }, [anio, mes]);

  const eliminar = useCallback(async (id) => {
    setError('');
    try {
      await eliminarGasto(id);
      await cargar();
      return true;
    } catch (err) {
      const mensaje = err?.message || err?.details || 'No se pudo eliminar el gasto.';
      setError(mensaje);
      return false;
    }
  }, [cargar]);

  useEffect(() => { cargar(); }, [cargar]);
  return { gastos, loading, error, recargar: cargar, eliminar };
}
