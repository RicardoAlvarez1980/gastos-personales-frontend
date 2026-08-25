import { useCallback, useEffect, useState } from 'react';
import { obtenerGastosPorPeriodo } from '../services/gastosService';

export function useGastos(anio, mes) {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    if (!anio || !mes) {
      setGastos([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await obtenerGastosPorPeriodo(anio, mes);
      setGastos(data);
    } catch (err) {
      setGastos([]);
      setError(err.message || 'No se pudieron cargar los gastos.');
    } finally {
      setLoading(false);
    }
  }, [anio, mes]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { gastos, loading, error, recargar: cargar };
}
