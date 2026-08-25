import { useEffect, useState } from 'react';
import { obtenerAnios, obtenerMeses } from '../services/gastosService';

export function usePeriodos() {
  const [anios, setAnios] = useState([]);
  const [anio, setAnio] = useState(null);
  const [meses, setMeses] = useState([]);
  const [mes, setMes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    setLoading(true);
    obtenerAnios()
      .then((items) => {
        if (!activo) return;
        const ordenados = [...items].filter(Number.isFinite).sort((a, b) => b - a);
        setAnios(ordenados);
        setAnio((actual) => actual ?? ordenados[0] ?? null);
      })
      .catch((err) => activo && setError(err.message))
      .finally(() => activo && setLoading(false));
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (anio == null) return;
    let activo = true;
    setMes(null);
    obtenerMeses(anio)
      .then((items) => {
        if (!activo) return;
        const ordenados = [...items].filter(Number.isFinite).sort((a, b) => a - b);
        setMeses(ordenados);
        setMes(ordenados[ordenados.length - 1] ?? null);
      })
      .catch((err) => activo && setError(err.message));
    return () => { activo = false; };
  }, [anio]);

  return { anios, anio, setAnio, meses, mes, setMes, loading, error };
}
