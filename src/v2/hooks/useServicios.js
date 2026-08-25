import { useEffect, useState } from 'react';
import { obtenerServicios } from '../services/serviciosService';

export function useServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    obtenerServicios()
      .then((data) => activo && setServicios(data))
      .catch((err) => activo && setError(err.message || 'No se pudieron cargar los servicios.'))
      .finally(() => activo && setLoading(false));
    return () => { activo = false; };
  }, []);

  return { servicios, loading, error };
}
