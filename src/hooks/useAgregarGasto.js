import { useState } from 'react';
import { actualizarImporteGasto, insertarGasto, verificarGastoExistente } from '../services/gastoMutations';

export function useAgregarGasto({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState(null);
  const [exito, setExito] = useState(null);

  const guardar = async (nuevo) => {
    setLoading(true); setError(''); setConfirmacion(null); setExito(null);
    try {
      const existente = await verificarGastoExistente(nuevo);
      if (existente) {
        setConfirmacion({ existente, nuevo });
        return false;
      }
      await insertarGasto(nuevo);
      await onSuccess?.(nuevo);
      setExito(nuevo);
      return true;
    } catch (err) {
      setError(err?.message || err?.details || 'No se pudo guardar el gasto.');
      return false;
    } finally { setLoading(false); }
  };

  const confirmar = async () => {
    if (!confirmacion) return false;
    setLoading(true); setError('');
    try {
      await actualizarImporteGasto(confirmacion.nuevo);
      const nuevo = confirmacion.nuevo;
      setConfirmacion(null);
      await onSuccess?.(nuevo);
      setExito(nuevo);
      return true;
    } catch (err) {
      setError(err?.message || err?.details || 'No se pudo actualizar el importe.');
      return false;
    } finally { setLoading(false); }
  };

  const cancelar = () => { if (!loading) setConfirmacion(null); };
  const cerrarExito = () => { if (!loading) setExito(null); };
  return { guardar, confirmar, cancelar, loading, error, confirmacion, exito, cerrarExito };
}
