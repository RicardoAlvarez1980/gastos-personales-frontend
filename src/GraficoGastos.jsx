import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

const NOMBRES_MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const COLORES = [
  "#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c",
  "#8dd1e1", "#83a6ed", "#8aabb0", "#c8c8c8", "#b0a990"
];

export default function GraficoGastos({ porAño, añoSeleccionado, añosDisponibles = [], onCambiarAño, onDeleteGasto, cargando }) {
  // Validaciones tempranas
  if (!Array.isArray(porAño) || porAño.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        No hay datos para mostrar.
      </div>
    );
  }

  if (!Array.isArray(añosDisponibles) || añosDisponibles.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: '#fff3cd',
        borderRadius: '8px'
      }}>
        No hay años disponibles.
      </div>
    );
  }

  // Formatear números con locale argentino
  const formatNumber = (num) => {
    return (num || 0).toLocaleString('es-AR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Obtener color para cada servicio
  const getColor = (idx) => COLORES[idx % COLORES.length];

  // Calcular datos del gráfico y servicios usando useMemo para optimización
  const { servicios, datosGrafico } = useMemo(() => {
    const serviciosUnicos = [...new Set(porAño.map(g => g.servicio))].filter(Boolean);

    // Inicializar estructura de meses
    const mesesData = {};
    for (let m = 1; m <= 12; m++) {
      mesesData[m] = { mes: NOMBRES_MESES[m - 1] };
      serviciosUnicos.forEach(s => {
        mesesData[m][s] = 0;
      });
    }

    // Agregar datos de gastos
    porAño.forEach(g => {
      const mesNum = Number(g.mes);
      if (mesNum >= 1 && mesNum <= 12 && g.servicio) {
        const importe = parseFloat(g.importe) || 0;
        mesesData[mesNum][g.servicio] = (mesesData[mesNum][g.servicio] || 0) + importe;
      }
    });

    return {
      servicios: serviciosUnicos,
      datosGrafico: Object.values(mesesData)
    };
  }, [porAño]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0', color: entry.color }}>
            {entry.name}: ${formatNumber(entry.value)}
          </p>
        ))}
        <p style={{ 
          margin: '8px 0 0 0', 
          paddingTop: '8px', 
          borderTop: '1px solid #eee',
          fontWeight: 'bold' 
        }}>
          Total: ${formatNumber(total)}
        </p>
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Selector de año */}
      <h3 style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        fontSize: '1.5rem'
      }}>
        Gastos del Año
        <select
          value={añoSeleccionado}
          onChange={(e) => onCambiarAño(e.target.value)}
          style={{
            backgroundColor: '#292929',
            color: '#ddd',
            border: '1px solid #61dafb',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontWeight: '600',
            fontSize: '1.1rem',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {añosDisponibles.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </h3>

      {/* Gráfico */}
      <div style={{ marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={datosGrafico} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="mes" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tickFormatter={valor => `${formatNumber(valor)}`}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            {servicios.map((servicio, idx) => (
              <Bar 
                key={servicio} 
                dataKey={servicio} 
                stackId="a" 
                fill={getColor(idx)} 
                name={servicio}
                radius={idx === servicios.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla detallada */}
      <div style={{ overflowX: 'auto' }}>
        <table 
          className="table"
          style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <thead>
            <tr style={{ 
              backgroundColor: '#343a40', 
              color: 'white',
              textAlign: 'center'
            }}>
              <th style={{ 
                padding: '12px', 
                border: '1px solid #dee2e6',
                position: 'sticky',
                left: 0,
                backgroundColor: '#343a40',
                zIndex: 1
              }}>
                Servicio / Mes
              </th>
              {NOMBRES_MESES.map(mes => (
                <th key={mes} style={{ 
                  padding: '12px', 
                  border: '1px solid #dee2e6',
                  minWidth: '80px'
                }}>
                  {mes}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio, idx) => (
              <tr key={servicio} style={{ 
                backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' 
              }}>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  fontWeight: '600',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white',
                  zIndex: 1
                }}>
                  {servicio}
                </td>
                {datosGrafico.map(dato => (
                  <td 
                    key={dato.mes} 
                    style={{ 
                      padding: '10px', 
                      border: '1px solid #dee2e6',
                      textAlign: 'right',
                      fontFamily: 'monospace'
                    }}
                  >
                    ${formatNumber(dato[servicio] || 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de gastos individuales con opción de eliminar */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#343a40' }}>
          Detalle de Gastos del Año {añoSeleccionado}
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table 
            className="table"
            style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <thead>
              <tr style={{ 
                backgroundColor: '#343a40', 
                color: 'white',
                textAlign: 'left'
              }}>
                <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Servicio</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Mes</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6' }}>Importe</th>
                <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {porAño.map((gasto, idx) => (
                <tr key={gasto.id || idx} style={{ 
                  backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' 
                }}>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                    {gasto.servicio}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                    {NOMBRES_MESES[gasto.mes - 1]} ({gasto.mes.toString().padStart(2, '0')})
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #dee2e6',
                    fontFamily: 'monospace',
                    fontWeight: '600'
                  }}>
                    ${formatNumber(parseFloat(gasto.importe))}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #dee2e6',
                    textAlign: 'center'
                  }}>
                    <button
                      onClick={() => onDeleteGasto(gasto.id)}
                      disabled={cargando}
                      style={{
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: cargando ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={e => !cargando && (e.target.style.backgroundColor = '#c82333')}
                      onMouseOut={e => !cargando && (e.target.style.backgroundColor = '#dc3545')}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}