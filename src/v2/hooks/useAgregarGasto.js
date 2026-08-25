import { useState } from 'react';
import { actualizarImporteGasto, insertarGasto, verificarGastoExistente } from '../services/gastoMutations';

export function useAgregarGasto({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState(null);

  const guardar = async (nuevo) => {
    setLoading(true);
    setError('');
    try {
      const existente = await verificarGastoExistente(nuevo);
      if (existente) {
        setConfirmacion({ existente, nuevo });
        return false;
      }
      await insertarGasto(nuevo);
      await onSuccess?.();
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo guardar el gasto.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const confirmar = async () => {
    if (!confirmacion) return;
    setLoading(true);
    setError('');
    try {
      await actualizarImporteGasto(confirmacion.nuevo);
      setConfirmacion(null);
      await onSuccess?.();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el importe.');
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
    setConfirmacion(null);
    setError('');
  };

  return { guardar, confirmar, cancelar, loading, error, confirmacion };
}
