import { useCallback, useEffect, useState } from 'react';
import { obtenerAnios, obtenerMeses } from '../services/gastosService';

export function usePeriodos() {
  const [anios, setAnios] = useState([]);
  const [anio, setAnio] = useState(null);
  const [meses, setMeses] = useState([]);
  const [mes, setMes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarAnios = useCallback(async () => {
    const items = await obtenerAnios();
    const ordenados = [...items].filter(Number.isFinite).sort((a, b) => b - a);
    setAnios(ordenados);
    return ordenados;
  }, []);

  const cargarMeses = useCallback(async (anioActual, mesPreferido = null) => {
    if (anioActual == null) {
      setMeses([]);
      setMes(null);
      return [];
    }

    const items = await obtenerMeses(anioActual);
    const ordenados = [...items].filter(Number.isFinite).sort((a, b) => a - b);
    setMeses(ordenados);
    setMes(actual => {
      const candidato = mesPreferido ?? actual;
      return candidato != null && ordenados.includes(Number(candidato))
        ? Number(candidato)
        : (ordenados[ordenados.length - 1] ?? null);
    });
    return ordenados;
  }, []);

  const refrescar = useCallback(async ({ anioPreferido = null, mesPreferido = null } = {}) => {
    setError('');
    const nuevosAnios = await cargarAnios();
    const anioObjetivo = anioPreferido != null && nuevosAnios.includes(Number(anioPreferido))
      ? Number(anioPreferido)
      : (nuevosAnios[0] ?? null);

    if (anioObjetivo == null) {
      setAnio(null);
      setMeses([]);
      setMes(null);
      return;
    }

    setAnio(anioObjetivo);
    await cargarMeses(anioObjetivo, mesPreferido);
  }, [cargarAnios, cargarMeses]);

  useEffect(() => {
    let activo = true;

    const inicializar = async () => {
      setLoading(true);
      setError('');
      try {
        const items = await cargarAnios();
        if (!activo) return;

        // Al iniciar siempre queda seleccionado el último año disponible.
        const ultimoAnio = items[0] ?? null;
        setAnio(ultimoAnio);

        if (ultimoAnio != null) {
          // Y dentro de ese año, el último mes que realmente tiene gastos.
          await cargarMeses(ultimoAnio);
        } else {
          setMeses([]);
          setMes(null);
        }
      } catch (err) {
        if (activo) setError(err?.message || 'No se pudieron cargar los períodos.');
      } finally {
        if (activo) setLoading(false);
      }
    };

    inicializar();
    return () => { activo = false; };
  }, [cargarAnios, cargarMeses]);

  useEffect(() => {
    if (anio == null) return;
    cargarMeses(anio).catch(err => setError(err?.message || 'No se pudieron cargar los meses.'));
  }, [anio, cargarMeses]);

  return { anios, anio, setAnio, meses, mes, setMes, loading, error, refrescar };
}
