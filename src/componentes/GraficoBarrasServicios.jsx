import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell, LabelList
} from 'recharts';
import servicios from '../data/serviciosConColores';
import { usePrefersColorScheme } from '../hooks/usePrefersColorScheme';
import { coloresLight, coloresDark } from '../data/colores';

function formatoTitulo(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .split('_')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

export default function GraficoBarrasServicios({ data }) {
  const mode = usePrefersColorScheme();
  const colores = mode === 'dark' ? coloresDark : coloresLight;

  if (!Array.isArray(data) || data.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>No hay datos para mostrar en el gráfico.</p>;
  }

  const dataFormateada = data.map(item => ({
    ...item,
    nombre_formateado: formatoTitulo(item.nombre_servicio),
  }));

  // Ajuste colores según modo
  const serviciosConColoresModo = servicios.map(s => {
    if (mode === 'dark' && s.color.toLowerCase() === coloresLight.amarillo) {
      return { ...s, color: colores.amarilloPastel };
    }
    return s;
  });

  // Leyenda personalizada con colores ajustados
  const leyendaData = dataFormateada.map(item => {
    const servicio = serviciosConColoresModo.find(s => s.nombre === item.nombre_servicio);
    return {
      nombre: formatoTitulo(item.nombre_servicio),
      color: servicio ? servicio.color : colores.cuadroLeyenda,
    };
  });

  // Formateo moneda
  const formatearImporte = (value) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

  // Renderizado custom etiquetas
const renderCustomLabel = (props) => {
  const { x, y, width, value, index } = props;
  const entry = dataFormateada[index];
  const servicio = serviciosConColoresModo.find(s => s.nombre === entry.nombre_servicio);
  const color = servicio ? servicio.color : colores.barraDefault;

  const labelX = x + width / 2;
  const topMargin = 20; // espacio desde el borde superior del gráfico
  const labelY = topMargin; // fija Y en un valor constante para alinear todas arriba

  return (
    <g>
      <rect
        x={labelX - 35}
        y={labelY - 14}
        width={70}
        height={24}
        fill={color}
        rx={4}
        ry={4}
      />
      <text
        x={labelX}
        y={labelY}
        fill="#fff"
        fontWeight="bold"
        fontSize={12}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {formatearImporte(value)}
      </text>
    </g>
  );
};


  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={dataFormateada}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
          style={{ backgroundColor: colores.fondo, borderRadius: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colores.texto} />
          <XAxis dataKey="nombre_formateado" tick={false} height={40} stroke={colores.texto} />
          <YAxis stroke={colores.texto} />
          <Tooltip
            formatter={(value) => formatearImporte(value)}
            contentStyle={{ backgroundColor: colores.cuadritoLeyendaFondo, color: colores.cuadritoTexto, borderRadius: 6 }}
            itemStyle={{ color: colores.cuadritoTexto }}
          />
          <Bar dataKey="importe_total">
            {dataFormateada.map((entry, index) => {
              const servicio = serviciosConColoresModo.find(s => s.nombre === entry.nombre_servicio);
              return (
                <Cell key={`cell-${index}`} fill={servicio ? servicio.color : colores.barraDefault} />
              );
            })}
            <LabelList dataKey="importe_total" content={renderCustomLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Leyenda totalmente custom */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: 10,
          backgroundColor: colores.cuadritoLeyendaFondo,
          padding: '10px 15px',
          borderRadius: 8,
        }}
      >
        {leyendaData.map(({ nombre, color }, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0 10px',
              color: colores.texto,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: color,
                marginRight: 6,
                borderRadius: 3,
              }}
            />
            <span>{nombre}</span>
          </div>
        ))}
      </div>
    </>
  );
}
