import { useState, useCallback } from 'react';

export const useGastos = (API_BASE_URL) => {
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleRequest = useCallback(async (endpoint, options = {}) => {
    setCargando(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (e) {
      setError(`Error: ${e.message}`);
      throw e;
    } finally {
      setCargando(false); 
    }
  }, [API_BASE_URL]);

  return {
    error,
    cargando,
    handleRequest
  };
};